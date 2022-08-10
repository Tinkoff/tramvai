import { declareAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const globalInLimit = declareAction({
  name: 'globalInLimit',
  async fn() {
    console.log('execute globalInLimit');
    await this.dispatch(set({ name: 'globalInLimit', value: false }));
    // set the execution delay less than the server's execution limit, so that this action will be executed in time to ssr
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await this.dispatch(set({ name: 'globalInLimit', value: true }));
  },
});

export const globalOutLimit = declareAction({
  name: 'globalOutLimit',
  async fn() {
    console.log('execute globalOutLimit');
    await this.dispatch(set({ name: 'globalOutLimit', value: false }));
    // set an execution delay higher than the server's execution limit, so that this action will not be executed in time with ssr
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));
    await this.dispatch(set({ name: 'globalOutLimit', value: true }));
  },
});
