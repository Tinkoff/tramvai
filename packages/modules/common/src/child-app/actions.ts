import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN } from '@tramvai/tokens-child-app';
import {
  ACTION_EXECUTION_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  COMBINE_REDUCERS,
} from '@tramvai/tokens-common';
import { actionTramvaiReducer } from '../actions/actionTramvaiReducer';

export const actionsProviders: Provider[] = [
  provide({
    provide: CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN,
    multi: true,
    useValue: [ACTION_EXECUTION_TOKEN, ACTION_PAGE_RUNNER_TOKEN],
  }),
  {
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: actionTramvaiReducer,
  },
];
