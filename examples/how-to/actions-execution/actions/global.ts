import { createAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const globalInLimit = createAction({
  name: 'globalInLimit',
  fn: async (context) => {
    console.log('execute globalInLimit');
    await context.dispatch(set({ name: 'globalInLimit', value: false }));
    // set the execution delay less than the server's execution limit, so that this action will be executed in time to ssr
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await context.dispatch(set({ name: 'globalInLimit', value: true }));
  },
});

export const globalOutLimit = createAction({
  name: 'globalOutLimit',
  fn: async (context) => {
    console.log('execute globalOutLimit');
    await context.dispatch(set({ name: 'globalOutLimit', value: false }));
    // set an execution delay higher than the server's execution limit, so that this action will not be executed in time with ssr
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));
    await context.dispatch(set({ name: 'globalOutLimit', value: true }));
  },
});
