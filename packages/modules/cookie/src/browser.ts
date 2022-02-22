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
    },
  ],
})
export class CookieModule {}
