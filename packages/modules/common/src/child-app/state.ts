import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN } from '@tramvai/tokens-child-app';
import { CONTEXT_TOKEN, DISPATCHER_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';

export const stateProviders: Provider[] = [
  provide({
    provide: CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN,
    multi: true,
    useValue: [DISPATCHER_TOKEN, STORE_TOKEN, CONTEXT_TOKEN],
  }),
];
