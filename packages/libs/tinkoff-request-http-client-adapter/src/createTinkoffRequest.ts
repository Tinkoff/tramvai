import either from '@tinkoff/utils/function/either';

import type { ContextState, Plugin, MakeRequest } from '@tinkoff/request-core';
import request from '@tinkoff/request-core';
import logPlugin from '@tinkoff/request-plugin-log';
import deduplicateCache from '@tinkoff/request-plugin-cache-deduplicate';
import memoryCache from '@tinkoff/request-plugin-cache-memory';
import validate from '@tinkoff/request-plugin-validate';
import http, { isNetworkFail, isServerError } from '@tinkoff/request-plugin-protocol-http';
import transformUrl from '@tinkoff/request-plugin-transform-url';
import type { Options as CircuitBreakerOptions } from '@tinkoff/request-plugin-circuit-breaker';
import circuitBreaker from '@tinkoff/request-plugin-circuit-breaker';
import type { HttpClientBaseOptions } from '@tramvai/http-client';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { createAgent } from './agent/createAgent';

const agent = createAgent();

export type RequestValidator = {
  (state: ContextState): any;
};

export interface TinkoffRequestOptions extends HttpClientBaseOptions {
  name?: string;
  logger?: typeof LOGGER_TOKEN;
  disableCache?: boolean;
  enableCircuitBreaker?: boolean;
  createCache?: (options: any) => any;
  cacheTime?: number;
  defaultTimeout?: number;
  validator?: RequestValidator;
  errorValidator?: RequestValidator;
  errorModificator?: RequestValidator;
  circuitBreakerOptions?: CircuitBreakerOptions;
}

export function createTinkoffRequest(options: TinkoffRequestOptions): MakeRequest {
  const {
    logger,
    name,
    disableCache,
    enableCircuitBreaker,
    createCache,
    cacheTime = 30000,
    defaultTimeout,
    validator,
    errorValidator,
    errorModificator,
    circuitBreakerOptions = {},
    ...defaults
  } = options;

  const log = logger && logger(`${name}:initialization`);
  const plugins: Plugin[] = [];

  plugins.push({
    init: (context, next) => {
      next({
        request: {
          timeout: defaultTimeout,
          ...context.getRequest(),
        },
      });
    },
  });

  plugins.push(
    transformUrl({
      baseUrl: defaults.baseUrl,
      transform: ({ baseUrl, path, url }) => {
        // если пользователь передал `url`, не модифицируем его, ожидается что это абсолютный URI
        if (url) {
          if (process.env.NODE_ENV === 'development') {
            if (url.indexOf('http') !== 0 && url.indexOf('//') !== 0) {
              log?.error(`url запроса должен содержать протокол и хост! текущее значение: ${url}`);
            }
          }
          return url;
        }
        if (baseUrl && path) {
          const baseUrlHasTrailSlash = baseUrl.slice(-1) === '/';
          const pathHasLeadSlash = path.slice(0, 1) === '/';
          const needSlash = !baseUrlHasTrailSlash;

          if (pathHasLeadSlash) {
            // eslint-disable-next-line no-param-reassign
            path = path.substring(1);
          }

          return `${baseUrl}${needSlash ? '/' : ''}${path}`;
        }
        if (process.env.NODE_ENV === 'development') {
          if (!baseUrl && !path) {
            log?.error(
              `запрос должен содержать url, или baseUrl с полным путем запроса, или baseUrl вместе с path!`
            );
          }
        }
        return baseUrl || path || '';
      },
    })
  );

  plugins.push(
    logPlugin({
      logger,
      name,
      showQueryFields: true,
      showPayloadFields: true,
    })
  );

  plugins.push(
    memoryCache({
      shouldExecute: !disableCache,
      lruOptions: { max: 1000, maxAge: cacheTime },
      allowStale: true,
      memoryConstructor: createCache,
    })
  );

  plugins.push(deduplicateCache());

  if (enableCircuitBreaker) {
    plugins.push(
      circuitBreaker({
        isSystemError: either(isServerError, isNetworkFail),
        ...circuitBreakerOptions,
      })
    );
  }

  plugins.push({
    error: (context, next) => {
      const state = context.getState();
      const error = errorModificator?.(state);

      if (error) {
        return next({
          error,
        });
      }

      return next();
    },
  });

  if (validator || errorValidator) {
    plugins.push(
      validate({
        validator,
        errorValidator,
        allowFallback: true,
      })
    );
  }

  plugins.push(http({ agent }));

  const makeRequest = request(plugins);

  return makeRequest;
}
