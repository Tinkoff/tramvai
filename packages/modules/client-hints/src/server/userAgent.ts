import type { Provider } from '@tramvai/core';
import { commandLineListTokens, Scope } from '@tramvai/core';
import { provide } from '@tramvai/core';
import {
  CREATE_CACHE_TOKEN,
  ENV_MANAGER_TOKEN,
  ENV_USED_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import { METRICS_MODULE_TOKEN } from '@tramvai/module-metrics';
import { parseClientHints } from '@tinkoff/user-agent';
import noop from '@tinkoff/utils/function/noop';
import { isNumber } from '@tinkoff/env-validators';

import { PARSER_CLIENT_HINTS_ENABLED, USER_AGENT_TOKEN } from '../tokens';
import { setUserAgent } from '../shared/stores/userAgent';
import { parseUserAgentWithCache } from './parseUserAgentWithCache';

export const serverUserAgentProviders: Provider[] = [
  provide({
    provide: 'userAgentCacheType',
    useFactory: ({ envManager }) => envManager.get('TRAMVAI_USER_AGENT_CACHE_TYPE'),
    deps: {
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: ENV_USED_TOKEN,
    useValue: [
      {
        key: 'TRAMVAI_USER_AGENT_CACHE_TYPE',
        value: 'memory',
        optional: true,
        validator: (value) => value === 'memory' || value === 'memory-lfu',
        dehydrate: false,
      },
      {
        key: 'TRAMVAI_USER_AGENT_CACHE_MAX',
        value: '50',
        optional: true,
        validator: isNumber,
        dehydrate: false,
      },
    ],
  }),
  provide({
    provide: 'userAgentMemoryCache',
    scope: Scope.SINGLETON,
    useFactory: ({ createCache, envManager, cacheType }) => {
      return createCache(cacheType, {
        max: Number(envManager.get('TRAMVAI_USER_AGENT_CACHE_MAX')),
      });
    },
    deps: {
      createCache: CREATE_CACHE_TOKEN,
      envManager: ENV_MANAGER_TOKEN,
      cacheType: 'userAgentCacheType',
    },
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ responseManager, envManager }) => {
      if (envManager.get('TRAMVAI_FORCE_CLIENT_SIDE_RENDERING') === 'true') {
        return noop;
      }

      return function setClientHintsHeaders() {
        responseManager.setHeader(
          'Accept-CH',
          'Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Model'
        );
      };
    },
    deps: {
      responseManager: RESPONSE_MANAGER_TOKEN,
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: USER_AGENT_TOKEN,
    useFactory: ({ requestManager, cache, parserClientHintsEnabled, store, metrics }) => {
      const userAgent =
        parserClientHintsEnabled && requestManager.getHeader('sec-ch-ua')
          ? parseClientHints(requestManager.getHeaders())
          : parseUserAgentWithCache(
              cache,
              requestManager.getHeader('user-agent') as string,
              metrics
            );

      store.dispatch(setUserAgent(userAgent));

      return userAgent;
    },
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
      parserClientHintsEnabled: PARSER_CLIENT_HINTS_ENABLED,
      store: STORE_TOKEN,
      cache: 'userAgentMemoryCache',
      metrics: 'userAgentCacheMetrics',
    },
  }),
  provide({
    provide: 'userAgentCacheMetrics',
    scope: Scope.SINGLETON,
    useFactory: ({ metrics }) => {
      const getCounter = metrics.counter({
        name: 'user_agent_cache_gets',
        help: 'Total attempts to get user agent parsed results from cache',
        labelNames: ['result'],
      });

      return {
        hit() {
          getCounter.inc({
            result: 'hit',
          });
        },
        miss() {
          getCounter.inc({
            result: 'miss',
          });
        },
      };
    },
    deps: {
      metrics: METRICS_MODULE_TOKEN,
    },
  }),
];
