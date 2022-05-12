import isNil from '@tinkoff/utils/is/nil';
import omit from '@tinkoff/utils/object/omit';
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
} from '@tramvai/tokens-common';
import { fillHeaderIp, fillHeaders, formatError } from '../utils';
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
  disableCircuitBreaker = false,
}: {
  logger: typeof LOGGER_TOKEN;
  envManager: typeof ENV_MANAGER_TOKEN;
  appInfo: typeof APP_INFO_TOKEN;
  requestManager?: typeof REQUEST_MANAGER_TOKEN;
  headersList?: typeof API_CLIENT_PASS_HEADERS;
  createCache?: typeof CREATE_CACHE_TOKEN;
  makeRequestRegistry: Map<string, MakeRequest>;
  agent?: typeof HTTP_CLIENT_AGENT;
  disableCircuitBreaker: typeof DISABLE_CIRCUIT_BREAKER;
}): typeof HTTP_CLIENT_FACTORY => {
  return (options: HttpClientFactoryOptions): HttpClient => {
    if (!options.name) {
      throw Error(`You need to pass a unique field "name" for the HTTP client instance`);
    }

    const forceDisableCache = envManager.get('HTTP_CLIENT_CACHE_DISABLED');
    const forceDisabledCircuitBreaker = envManager.get('HTTP_CLIENT_CIRCUIT_BREAKER_DISABLED');

    const adapterOptions: TinkoffRequestOptions = mergeOptions(
      {
        logger,
        agent,
        method: 'GET',
        createCache: createCache
          ? (cacheOptions: any): Cache => createCache('memory', cacheOptions)
          : undefined,
        modifyRequest: compose(
          fillHeaderIp({ requestManager }),
          fillHeaders({ requestManager, headersList })
        ),
        modifyError: formatError,
        circuitBreakerOptions: {
          failureThreshold: 75,
          minimumFailureCount: 10,
        },
        ...environmentDependentOptions,
      },
      options
    ) as TinkoffRequestOptions;

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

    const makeRequest = makeRequestRegistry.get(adapterOptions.name);

    const httpClientAdapter = new HttpClientAdapter({
      options: adapterOptions as HttpClientBaseOptions,
      makeRequest,
    });

    return httpClientAdapter;
  };
};
