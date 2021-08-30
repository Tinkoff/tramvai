import { Module, Scope } from '@tramvai/core';
import { CookieManager } from './cookieManager.browser';
import { COOKIE_MANAGER_TOKEN } from './tokens';

export { COOKIE_MANAGER_TOKEN };

@Module({
  providers: [
    {
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
      },
    },
  ],
})
export class CookieModule {}
