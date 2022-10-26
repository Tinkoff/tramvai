import type { Provider } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN } from '@tramvai/tokens-child-app';
import { CLEAR_CACHE_TOKEN, CREATE_CACHE_TOKEN } from '@tramvai/tokens-common';
import { cachesToken } from '../cache/CacheModule';

export const actionsProviders: Provider[] = [
  provide({
    provide: CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN,
    multi: true,
    useValue: [CREATE_CACHE_TOKEN, CLEAR_CACHE_TOKEN],
  }),
  provide({
    provide: cachesToken,
    scope: Scope.SINGLETON,
    useValue: [],
  }),
];
