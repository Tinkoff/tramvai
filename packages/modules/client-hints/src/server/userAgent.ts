import type { Provider } from '@tramvai/core';
import { Scope, commandLineListTokens } from '@tramvai/core';
import { provide } from '@tramvai/core';
import {
  CREATE_CACHE_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import type { UserAgent } from '@tinkoff/user-agent';
import { parseUserAgentHeader, parseClientHints } from '@tinkoff/user-agent';
import { PARSER_CLIENT_HINTS_ENABLED, USER_AGENT_TOKEN } from '../tokens';
import { setUserAgent } from '../shared/stores/userAgent';

export const userAgentProviders: Provider[] = [
  provide({
    provide: 'userAgentLruCache',
    scope: Scope.SINGLETON,
    useFactory: ({ createCache }) => {
      return createCache('memory', { max: 50 });
    },
    deps: {
      createCache: CREATE_CACHE_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ store, userAgent }: { store: typeof STORE_TOKEN; userAgent: UserAgent }) => {
      return function initUserAgent() {
        return store.dispatch(setUserAgent(userAgent));
      };
    },
    deps: {
      userAgent: USER_AGENT_TOKEN,
      store: STORE_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ responseManager }) => {
      return function setClientHintsHeaders() {
        responseManager.setHeader(
          'Accept-CH',
          'Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Model'
        );
      };
    },
    deps: {
      responseManager: RESPONSE_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: USER_AGENT_TOKEN,
    useFactory: ({ requestManager, cache, parserClientHintsEnabled }) => {
      if (parserClientHintsEnabled && requestManager.getHeader('sec-ch-ua')) {
        return parseClientHints(requestManager.getHeaders());
      }

      const userAgentHeader = requestManager.getHeader('user-agent') as string;
      if (cache.has(userAgentHeader)) {
        return cache.get(userAgentHeader);
      }
      const result = parseUserAgentHeader(userAgentHeader);
      cache.set(userAgentHeader, result);
      return result;
    },
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
      parserClientHintsEnabled: PARSER_CLIENT_HINTS_ENABLED,
      cache: 'userAgentLruCache',
    },
  }),
];
