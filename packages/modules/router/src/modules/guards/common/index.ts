import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { BUNDLE_MANAGER_TOKEN, LOGGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { PAGE_REGISTRY_TOKEN, ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';

import { loadBundle } from './loadBundle';
import { internalError } from './internalError';

export const commonGuards: Provider[] = [
  provide({
    provide: ROUTER_GUARD_TOKEN,
    multi: true,
    useFactory: loadBundle,
    deps: {
      logger: LOGGER_TOKEN,
      bundleManager: BUNDLE_MANAGER_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
      pageRegistry: PAGE_REGISTRY_TOKEN,
    },
  }),
  provide({
    provide: ROUTER_GUARD_TOKEN,
    multi: true,
    useFactory: internalError,
    deps: {
      logger: LOGGER_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
    },
  }),
];
