import type { Provider } from '@tramvai/core';
import { commandLineListTokens, Scope } from '@tramvai/core';
import { provide } from '@tramvai/core';
import {
  CREATE_CACHE_TOKEN,
  ENV_MANAGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import { parseClientHints } from '@tinkoff/user-agent';
import noop from '@tinkoff/utils/function/noop';

import { PARSER_CLIENT_HINTS_ENABLED, USER_AGENT_TOKEN } from '../tokens';
import { setUserAgent } from '../shared/stores/userAgent';
import { parseUserAgentWithCache } from './parseUserAgentWithCache';

export const serverUserAgentProviders: Provider[] = [
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
    useFactory: ({ requestManager, cache, parserClientHintsEnabled, store }) => {
      const userAgent =
        parserClientHintsEnabled && requestManager.getHeader('sec-ch-ua')
          ? parseClientHints(requestManager.getHeaders())
          : parseUserAgentWithCache(cache, requestManager.getHeader('user-agent') as string);

      store.dispatch(setUserAgent(userAgent));

      return userAgent;
    },
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
      parserClientHintsEnabled: PARSER_CLIENT_HINTS_ENABLED,
      store: STORE_TOKEN,
      cache: 'userAgentLruCache',
    },
  }),
];
