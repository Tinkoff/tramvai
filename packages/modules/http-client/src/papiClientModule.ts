import { Module, DI_TOKEN, provide, Scope } from '@tramvai/core';
import {
  SERVER_MODULE_PAPI_PUBLIC_ROUTE,
  SERVER_MODULE_PAPI_PUBLIC_URL,
} from '@tramvai/tokens-server';
import { PAPI_SERVICE, HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import { PapiService } from './papi/papiService';

@Module({
  providers: [
    provide({
      provide: PAPI_SERVICE,
      scope: Scope.SINGLETON,
      useClass: PapiService,
      deps: {
        di: DI_TOKEN,
        httpClientFactory: HTTP_CLIENT_FACTORY,
        baseUrl: SERVER_MODULE_PAPI_PUBLIC_URL,
        papi: { token: SERVER_MODULE_PAPI_PUBLIC_ROUTE, optional: true, multi: true as const },
      },
    }),
  ],
})
export class PapiClientModule {}
