import { Module, commandLineListTokens } from '@tramvai/core';
import {
  REQUEST_MANAGER_TOKEN,
  STORE_TOKEN,
  CONTEXT_TOKEN,
  COOKIE_MANAGER_TOKEN,
} from '@tramvai/module-common';
import type { UserAgent } from '@tinkoff/user-agent';
import { parse } from '@tinkoff/user-agent';
import { setUserAgent } from './shared/stores/userAgent';
import { readMediaCommand } from './server/readMedia';
import { USER_AGENT_TOKEN } from './tokens';
import { providers } from './shared/providers';

export * from './tokens';
export * from './shared/stores/mediaCheckers';
export * from './shared/stores/mediaSelectors';
export * from './shared/stores/media';
export * from './shared/stores/userAgent';

@Module({
  providers: [
    ...providers,
    {
      provide: USER_AGENT_TOKEN,
      useFactory: ({ requestManager }) => {
        return parse(requestManager.getHeader('user-agent') as string);
      },
      deps: {
        requestManager: REQUEST_MANAGER_TOKEN,
      },
    },
    {
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
    },
    {
      provide: commandLineListTokens.resolveUserDeps,
      multi: true,
      useFactory: readMediaCommand,
      deps: {
        context: CONTEXT_TOKEN,
        cookieManager: COOKIE_MANAGER_TOKEN,
      },
    },
  ],
})
export class ClientHintsModule {}
