import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import noop from '@tinkoff/utils/function/noop';
import { CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN } from '@tramvai/tokens-child-app';
import {
  ACTION_EXECUTION_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  COMBINE_REDUCERS,
} from '@tramvai/tokens-common';
import { COMMAND_LINE_EXECUTION_END_TOKEN } from '@tramvai/tokens-core-private';
import { actionTramvaiReducer } from '../actions/actionTramvaiReducer';

export const actionsProviders: Provider[] = [
  provide({
    provide: CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN,
    multi: true,
    useValue: [ACTION_EXECUTION_TOKEN, ACTION_PAGE_RUNNER_TOKEN],
  }),
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: actionTramvaiReducer,
  }),
  // We don't need to launch COMMAND_LINE_EXECUTION_END_TOKEN on
  // each ChildApp, because we want to token execute only once for root App.
  provide({
    provide: COMMAND_LINE_EXECUTION_END_TOKEN,
    multi: true,
    useValue: noop,
  }),
];
