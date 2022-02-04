import { provide } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';
import { PageErrorStore } from './pageErrorStore';

export const providers = [
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: PageErrorStore,
  }),
];
