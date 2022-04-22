import { commandLineListTokens, Module, provide } from '@tramvai/core';
import { CONTEXT_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-cookie';
import { USER_AGENT_TOKEN } from './tokens';
import { matchMediaCommand } from './browser/matchMedia';
import { providers } from './shared/providers';
import { UserAgentStore } from './shared/stores/userAgent';

export * from './tokens';
export * from './shared/stores/mediaCheckers';
export * from './shared/stores/mediaSelectors';
export * from './shared/stores/media';
export * from './shared/stores/userAgent';

export { ClientHintsChildAppModule } from './child-app/module';

@Module({
  providers: [
    ...providers,
    provide({
      provide: USER_AGENT_TOKEN,
      useFactory: ({ store }) => {
        return store.getState(UserAgentStore);
      },
      deps: {
        store: STORE_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.clear,
      multi: true,
      useFactory: matchMediaCommand,
      deps: {
        context: CONTEXT_TOKEN,
        cookieManager: COOKIE_MANAGER_TOKEN,
      },
    }),
  ],
})
export class ClientHintsModule {}
