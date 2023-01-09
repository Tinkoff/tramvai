import { Module, provide, Scope } from '@tramvai/core';
import { REQUEST_MANAGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { ClientHintsModule, USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import { CookieManager } from './cookieManager.server';
import { COOKIE_MANAGER_TOKEN } from './tokens';

export { COOKIE_MANAGER_TOKEN };

@Module({
  imports: [ClientHintsModule],
  providers: [
    provide({
      // Управление куками в приложении
      provide: COOKIE_MANAGER_TOKEN,
      useClass: CookieManager,
      scope: Scope.REQUEST,
      deps: {
        requestManager: REQUEST_MANAGER_TOKEN,
        responseManager: RESPONSE_MANAGER_TOKEN,
        userAgent: USER_AGENT_TOKEN,
      },
    }),
  ],
})
export class CookieModule {}
