import { declareAction } from '@tramvai/core';
import { setAction } from '../stores/actions';

const payload = typeof window === 'undefined' ? 'server' : 'client';

const bundleActionClient = declareAction({
  name: 'bundleActionClient',
  fn() {
    return this.dispatch(setAction({ name: 'bundleActionsClient', payload }));
  },
  conditions: {
    onlyBrowser: true,
  },
});

const bundleActionServer = declareAction({
  name: 'bundleActionServer',
  fn() {
    return this.dispatch(setAction({ name: 'bundleActionsServer', payload }));
  },
  conditions: {
    onlyServer: true,
  },
});

const bundleAction = declareAction({
  name: 'bundleAction',
  fn() {
    return this.dispatch(setAction({ name: 'bundleActions', payload }));
  },
});

export const bundleActions = [bundleActionClient, bundleActionServer, bundleAction];
