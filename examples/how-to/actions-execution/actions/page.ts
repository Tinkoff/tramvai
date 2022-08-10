import { declareAction } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from '../constants';
import { set } from '../store';

export const pageInLimit = declareAction({
  name: 'pageInLimit',
  async fn() {
    console.log('execute pageInLimit');
    await this.dispatch(set({ name: 'pageInLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT / 2));
    await this.dispatch(set({ name: 'pageInLimit', value: true }));
  },
});

export const pageOutLimit = declareAction({
  name: 'pageOutLimit',
  async fn() {
    console.log('execute pageOutLimit');
    await this.dispatch(set({ name: 'pageOutLimit', value: false }));
    await new Promise((res) => setTimeout(res, ACTION_EXECUTION_LIMIT * 2));
    await this.dispatch(set({ name: 'pageOutLimit', value: true }));
  },
});
