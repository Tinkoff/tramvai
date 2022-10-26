import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { SERVER_MODULE_PAPI_PRIVATE_ROUTE } from '@tramvai/tokens-server';
import { CLEAR_CACHE_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import { papiClearCache } from './papi';

export const providers: Provider[] = [
  provide({
    provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
    multi: true,
    useFactory: papiClearCache,
    deps: {
      clearCache: CLEAR_CACHE_TOKEN,
      logger: LOGGER_TOKEN,
    },
  }),
];
