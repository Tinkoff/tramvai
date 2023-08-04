import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { commandLineListTokens } from '@tramvai/core';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-cookie';
import { readMediaCommand } from '../server/readMedia';
import { commonProviders } from './providers';

export const serverProviders: Provider[] = [
  ...commonProviders,
  provide({
    provide: commandLineListTokens.resolveUserDeps,
    multi: true,
    useFactory: readMediaCommand,
    deps: {
      context: CONTEXT_TOKEN,
      cookieManager: COOKIE_MANAGER_TOKEN,
    },
  }),
];
