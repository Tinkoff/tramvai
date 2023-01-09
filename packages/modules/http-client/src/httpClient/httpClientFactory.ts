import isNil from '@tinkoff/utils/is/nil';
import compose from '@tinkoff/utils/function/compose';
import type { MakeRequest } from '@tinkoff/request-core';
import type { HttpClient, HttpClientBaseOptions } from '@tramvai/http-client';
import type { TinkoffRequestOptions } from '@tramvai/tinkoff-request-http-client-adapter';
import {
  mergeOptions,
  createTinkoffRequest,
  HttpClientAdapter,
} from '@tramvai/tinkoff-request-http-client-adapter';
import type { APP_INFO_TOKEN } from '@tramvai/core';
import type {
  API_CLIENT_PASS_HEADERS,
  HttpClientFactoryOptions,
  HTTP_CLIENT_AGENT,
  HTTP_CLIENT_FACTORY,
  DISABLE_CIRCUIT_BREAKER,
} from '@tramvai/tokens-http-client';
import type {
  LOGGER_TOKEN,
  CREATE_CACHE_TOKEN,
  Cache,
  ENV_MANAGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  CacheOptionsByType,
  COMMAND_LINE_EXECUTION_CONTEXT_TOKEN,
} from '@tramvai/tokens-common';
import type { QuerySerializer } from '@tinkoff/request-plugin-protocol-http';
import type { ExtractDependencyType, ExtractTokenType } from '@tinkoff/dippy';
import { fillHeaderIp, fillHeaders } from '../utils';
import { createUserAgent } from './createUserAgent';

const environmentDependentOptions =
  typeof window === 'undefined'
    ? {
        defaultTimeout: 2000,
      }
    : {
        defaultTimeout: 30000,
      };

export const httpClientFactory = ({
  logger,
  envManager,
  appInfo,
  requestManager,
  headersList,
  createCache,
  makeRequestRegistry,
  agent,
  querySerializer,
  disableCircuitBreaker = false,
  defaultOptions,
  commandLineExecutionContext,
}: {
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
  envManager: ExtractDependencyType<typeof ENV_MANAGER_TOKEN>;
  appInfo: ExtractDependencyType<typeof APP_INFO_TOKEN>;
  requestManager: ExtractDependencyType<typeof REQUEST_MANAGER_TOKEN> | null;
  headersList: ExtractDependencyType<typeof API_CLIENT_PASS_HEADERS> | null;
  createCache: ExtractDependencyType<typeof CREATE_CACHE_TOKEN> | null;
  makeRequestRegistry: Map<string, MakeRequest>;
  agent: ExtractDependencyType<typeof HTTP_CLIENT_AGENT> | null;
  querySerializer?: QuerySerializer;
  disableCircuitBreaker: ExtractDependencyType<typeof DISABLE_CIRCUIT_BREAKER> | null;
  defaultOptions: Partial<HttpClientFactoryOptions> | null;
  commandLineExecutionContext: ExtractDependencyType<
    typeof COMMAND_LINE_EXECUTION_CONTEXT_TOKEN
  > | null;
}): ExtractTokenType<typeof HTTP_CLIENT_FACTORY> => {
  return (options: HttpClientFactoryOptions): HttpClient => {
    if (!options.name) {
      throw Error(`You need to pass a unique field "name" for the HTTP client instance`);
    }

    const forceDisableCache = envManager.get('HTTP_CLIENT_CACHE_DISABLED');
    const forceDisabledCircuitBreaker = envManager.get('HTTP_CLIENT_CIRCUIT_BREAKER_DISABLED');

    const adapterOptions = mergeOptions(
      mergeOptions(
        {
          logger,
          agent,
          querySerializer,
          method: 'GET',
          createCache: createCache
            ? (cacheOptions: CacheOptionsByType<any>['memory'][0]): Cache =>
                createCache('memory', cacheOptions)
            : undefined,
          modifyRequest: compose(
            fillHeaderIp({ requestManager }),
            fillHeaders({ requestManager, headersList })
          ),
          circuitBreakerOptions: {
            failureThreshold: 75,
            minimumFailureCount: 10,
          },
          // TODO: remove any after [resolving](https://github.com/southpolesteve/node-abort-controller/issues/31)
          signal: commandLineExecutionContext?.()?.abortSignal as any,
          ...environmentDependentOptions,
        },
        defaultOptions ?? {}
      ),
      options
    ) as TinkoffRequestOptions & { name: string };

    // по умолчанию, на сервере, библиотека https://github.com/node-fetch/node-fetch
    // отправляет заголовок "User-Agent" вида "node-fetch".
    // для улучшения логов сервисов, в которые делают запросы tramvai приложения,
    // заменяем "User-Agent" на кастомный, содержащий название и версию приложения
    if (typeof window === 'undefined') {
      adapterOptions.headers = {
        'User-Agent': createUserAgent({ appInfo, envManager }),
        ...adapterOptions.headers,
      };
    }

    if (!isNil(forceDisableCache)) {
      adapterOptions.disableCache = !!forceDisableCache;
    }

    if (disableCircuitBreaker) {
      adapterOptions.enableCircuitBreaker = false;
    }

    // environment variable in priority over disableCircuitBreaker
    if (!isNil(forceDisabledCircuitBreaker)) {
      adapterOptions.enableCircuitBreaker = !forceDisabledCircuitBreaker;
    }

    // кэшируем инстанс @tinkoff/request
    if (!makeRequestRegistry.has(adapterOptions.name)) {
      makeRequestRegistry.set(adapterOptions.name, createTinkoffRequest(adapterOptions));
    }

    const makeRequest = makeRequestRegistry.get(adapterOptions.name)!;

    const httpClientAdapter = new HttpClientAdapter({
      options: adapterOptions as HttpClientBaseOptions,
      makeRequest,
    });

    return httpClientAdapter;
  };
};
