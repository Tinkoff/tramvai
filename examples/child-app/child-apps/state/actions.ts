import { createAction } from '@tramvai/core';
import { updateTestEvent } from './stores';

export const updateRootValueAction = createAction({
  name: 'child-app-test',
  fn(context) {
    // await new Promise((resolve) => setTimeout(resolve, 6000));
    return context.dispatch(updateTestEvent(typeof window === 'undefined' ? 'server' : 'client'));
  },
  conditions: {},
});
