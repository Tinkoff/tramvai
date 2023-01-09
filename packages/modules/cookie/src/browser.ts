import { Module, provide, Scope } from '@tramvai/core';
import { ClientHintsModule, USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import { CookieManager } from './cookieManager.browser';
import { COOKIE_MANAGER_TOKEN } from './tokens';

export { COOKIE_MANAGER_TOKEN };

@Module({
  imports: [ClientHintsModule],
  providers: [
    provide({
      // Управление куками в приложении
      provide: COOKIE_MANAGER_TOKEN,
      useClass: CookieManager,
      scope: Scope.SINGLETON,
      deps: {
        // cookieOptions позволяет переопределить SameSite=Lax на None для фикса проблем с iframe
        // TODO после успешного тестирования в приложении paymentsext, убрать прокидывание cookieOptions
        //  и установить SameSite=None по умолчанию
        cookieOptions: {
          token: 'temporary cookieOptions',
          optional: true,
        },
        userAgent: USER_AGENT_TOKEN,
      },
    }),
  ],
})
export class CookieModule {}
