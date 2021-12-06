import { Module, DI_TOKEN, provide, Scope } from '@tramvai/core';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { PAPI_SERVICE } from '@tramvai/tokens-http-client';
import { PapiService } from './papi/papiService';

export { PapiService };

@Module({
  providers: [
    provide({
      provide: PAPI_SERVICE,
      scope: Scope.SINGLETON,
      useClass: PapiService,
      deps: {
        di: DI_TOKEN,
        papi: { token: SERVER_MODULE_PAPI_PUBLIC_ROUTE, optional: true, multi: true as const },
      },
    }),
  ],
})
export class PapiClientModule {}
