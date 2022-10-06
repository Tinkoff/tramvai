import type { Provider } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import { REQUEST_MANAGER_TOKEN, COMBINE_REDUCERS } from '@tramvai/tokens-common';
import { FASTIFY_REQUEST } from '@tramvai/tokens-server-private';
import { RequestManager } from './requestManager';
import { RequestManagerStore } from './RequestManagerStore';

export const sharedProviders: Provider[] = [
  {
    provide: REQUEST_MANAGER_TOKEN,
    scope: Scope.REQUEST,
    useClass: RequestManager,
    deps: {
      request: FASTIFY_REQUEST,
    },
  },
  {
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: RequestManagerStore,
  },
];
