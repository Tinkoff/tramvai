import { createAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const pageInLimit = createAction({
  name: 'pageInLimit',
  fn: async (context) => {
    console.log('execute pageInLimit');
    await context.dispatch(set({ name: 'pageInLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await context.dispatch(set({ name: 'pageInLimit', value: true }));
  },
});

export const pageOutLimit = createAction({
  name: 'pageOutLimit',
  fn: async (context) => {
    console.log('execute pageOutLimit');
    await context.dispatch(set({ name: 'pageOutLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));
    await context.dispatch(set({ name: 'pageOutLimit', value: true }));
  },
});
