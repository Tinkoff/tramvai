import type { Provider } from '@tramvai/core';
import { ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';
import {
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  LOGGER_TOKEN,
} from '@tramvai/tokens-common';
import { httpMethod } from './httpMethod';

export const serverGuards: Provider[] = [
  {
    provide: ROUTER_GUARD_TOKEN,
    multi: true,
    useFactory: httpMethod,
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
      logger: LOGGER_TOKEN,
    },
  },
];
