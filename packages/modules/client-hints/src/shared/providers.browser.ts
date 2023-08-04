import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { commandLineListTokens } from '@tramvai/core';
import { CONTEXT_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-cookie';
import { matchMediaCommand } from '../browser/matchMedia';
import { USER_AGENT_TOKEN } from '../tokens';
import { UserAgentStore } from './stores/userAgent';

import { commonProviders } from './providers';

export const browserProviders: Provider[] = [
  ...commonProviders,
  provide({
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: matchMediaCommand,
    deps: {
      context: CONTEXT_TOKEN,
      cookieManager: COOKIE_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: USER_AGENT_TOKEN,
    useFactory: ({ store }) => {
      return store.getState(UserAgentStore);
    },
    deps: {
      store: STORE_TOKEN,
    },
  }),
];
