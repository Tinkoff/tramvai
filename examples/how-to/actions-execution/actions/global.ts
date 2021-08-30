import { createAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const globalInLimit = createAction({
  name: 'globalInLimit',
  fn: async (context) => {
    console.log('execute globalInLimit');
    await context.dispatch(set({ name: 'globalInLimit', value: false }));
    // ставим задержку выполнения меньше, чем лимит выполнения на сервере, чтобы этот экшен точно успел выполниться при ssr
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await context.dispatch(set({ name: 'globalInLimit', value: true }));
  },
});

export const globalOutLimit = createAction({
  name: 'globalOutLimit',
  fn: async (context) => {
    console.log('execute globalOutLimit');
    await context.dispatch(set({ name: 'globalOutLimit', value: false }));
    // ставим задержку выполнения больше, чем лимит выполнения на сервере, чтобы этот экшен точно не успел выполниться при ssr
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));
    await context.dispatch(set({ name: 'globalOutLimit', value: true }));
  },
});
