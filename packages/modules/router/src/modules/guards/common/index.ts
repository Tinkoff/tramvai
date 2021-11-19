import type { Provider } from '@tramvai/core';
import {
  BUNDLE_MANAGER_TOKEN,
  ACTION_REGISTRY_TOKEN,
  LOGGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import { ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';

import { loadBundle } from './loadBundle';
import { internalError } from './internalError';

export const commonGuards: Provider[] = [
  {
    provide: ROUTER_GUARD_TOKEN,
    multi: true,
    useFactory: loadBundle,
    deps: {
      logger: LOGGER_TOKEN,
      bundleManager: BUNDLE_MANAGER_TOKEN,
      actionRegistry: ACTION_REGISTRY_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
    },
  },
  {
    provide: ROUTER_GUARD_TOKEN,
    multi: true,
    useFactory: internalError,
    deps: {
      logger: LOGGER_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
    },
  },
];
