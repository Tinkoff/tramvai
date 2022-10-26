import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { ResponseManager } from './responseManager';

export const sharedProviders: Provider[] = [
  provide({
    provide: RESPONSE_MANAGER_TOKEN,
    scope: Scope.REQUEST,
    useClass: ResponseManager,
  }),
];
