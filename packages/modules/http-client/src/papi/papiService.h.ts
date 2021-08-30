import type { DI_TOKEN } from '@tramvai/core';
import type { HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import type {
  SERVER_MODULE_PAPI_PUBLIC_ROUTE,
  SERVER_MODULE_PAPI_PUBLIC_URL,
} from '@tramvai/tokens-server';

export interface Deps {
  di: typeof DI_TOKEN;
  httpClientFactory: typeof HTTP_CLIENT_FACTORY;
  baseUrl: typeof SERVER_MODULE_PAPI_PUBLIC_URL;
  papi?: typeof SERVER_MODULE_PAPI_PUBLIC_ROUTE[];
}
