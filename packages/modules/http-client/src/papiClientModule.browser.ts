import { Module, provide, Scope } from '@tramvai/core';
import { SERVER_MODULE_PAPI_PUBLIC_URL } from '@tramvai/tokens-server';
import { PAPI_SERVICE, HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import { PapiService } from './papi/papiService.browser';

export { PapiService };

@Module({
  providers: [
    provide({
      provide: PAPI_SERVICE,
      scope: Scope.SINGLETON,
      useClass: PapiService,
      deps: {
        httpClientFactory: HTTP_CLIENT_FACTORY,
        baseUrl: SERVER_MODULE_PAPI_PUBLIC_URL,
      },
    }),
  ],
})
export class PapiClientModule {}
