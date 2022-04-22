import { Module, commandLineListTokens, Scope } from '@tramvai/core';
import {
  REQUEST_MANAGER_TOKEN,
  STORE_TOKEN,
  CONTEXT_TOKEN,
  CREATE_CACHE_TOKEN,
} from '@tramvai/tokens-common';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-cookie';
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

export { ClientHintsChildAppModule } from './child-app/module';

@Module({
  providers: [
    ...providers,
    {
      provide: 'userAgentLruCache',
      scope: Scope.SINGLETON,
      useFactory: ({ createCache }) => {
        return createCache('userAgent', { max: 50 });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
    },
    {
      provide: USER_AGENT_TOKEN,
      useFactory: ({ requestManager, cache }) => {
        const reqUserAgent = requestManager.getHeader('user-agent') as string;
        if (cache.has(reqUserAgent)) {
          return cache.get(reqUserAgent);
        }
        const result = parse(reqUserAgent);
        cache.set(reqUserAgent, result);
        return result;
      },
      deps: {
        requestManager: REQUEST_MANAGER_TOKEN,
        cache: 'userAgentLruCache',
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
