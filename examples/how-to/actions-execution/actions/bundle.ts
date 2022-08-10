import { declareAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const bundleInLimit = declareAction({
  name: 'bundleInLimit',
  async fn() {
    console.log('execute bundleInLimit');
    await this.dispatch(set({ name: 'bundleInLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await this.dispatch(set({ name: 'bundleInLimit', value: true }));
  },
});

export const bundleOutLimit = declareAction({
  name: 'bundleOutLimit',
  async fn() {
    console.log('execute bundleOutLimit');
    await this.dispatch(set({ name: 'bundleOutLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));

    if (this.abortSignal.aborted) {
      console.log('ignore any actions as execution was aborted');
      return;
    }

    await this.dispatch(set({ name: 'bundleOutLimit', value: true }));
  },
});
