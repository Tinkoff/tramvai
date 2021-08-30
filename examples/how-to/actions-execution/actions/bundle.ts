import { createAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const bundleInLimit = createAction({
  name: 'bundleInLimit',
  fn: async (context) => {
    console.log('execute bundleInLimit');
    await context.dispatch(set({ name: 'bundleInLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await context.dispatch(set({ name: 'bundleInLimit', value: true }));
  },
});

export const bundleOutLimit = createAction({
  name: 'bundleOutLimit',
  fn: async (context) => {
    console.log('execute bundleOutLimit');
    await context.dispatch(set({ name: 'bundleOutLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));
    await context.dispatch(set({ name: 'bundleOutLimit', value: true }));
  },
});
