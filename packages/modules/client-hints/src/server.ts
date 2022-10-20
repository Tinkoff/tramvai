import { Module, commandLineListTokens, provide } from '@tramvai/core';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-cookie';
import { readMediaCommand } from './server/readMedia';
import { providers } from './shared/providers';
import { userAgentProviders } from './server/userAgent';
import { PARSER_CLIENT_HINTS_ENABLED } from './tokens';

export * from './tokens';
export * from './shared/stores/mediaCheckers';
export * from './shared/stores/mediaSelectors';
export * from './shared/stores/media';
export * from './shared/stores/userAgent';

export { ClientHintsChildAppModule } from './child-app/module';

@Module({
  providers: [
    ...providers,
    ...userAgentProviders,
    provide({
      provide: commandLineListTokens.resolveUserDeps,
      multi: true,
      useFactory: readMediaCommand,
      deps: {
        context: CONTEXT_TOKEN,
        cookieManager: COOKIE_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: PARSER_CLIENT_HINTS_ENABLED,
      useValue: true,
    }),
  ],
})
export class ClientHintsModule {}
