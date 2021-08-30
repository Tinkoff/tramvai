import type { Provider } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import { RESPONSE, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { ResponseManager } from './responseManager';

export const sharedProviders: Provider[] = [
  {
    provide: RESPONSE_MANAGER_TOKEN,
    scope: Scope.REQUEST,
    useClass: ResponseManager,
    deps: {
      response: RESPONSE,
    },
  },
];
