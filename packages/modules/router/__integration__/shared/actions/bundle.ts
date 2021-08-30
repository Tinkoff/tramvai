import { createAction } from '@tramvai/core';
import { setAction } from '../stores/actions';

const payload = typeof window === 'undefined' ? 'server' : 'client';

const bundleActionClient = createAction({
  name: 'bundleActionClient',
  fn: (context) => {
    return context.dispatch(setAction({ name: 'bundleActionsClient', payload }));
  },
  conditions: {
    onlyBrowser: true,
  },
});

const bundleActionServer = createAction({
  name: 'bundleActionServer',
  fn: (context) => {
    return context.dispatch(setAction({ name: 'bundleActionsServer', payload }));
  },
  conditions: {
    onlyServer: true,
  },
});

const bundleAction = createAction({
  name: 'bundleAction',
  fn: (context) => {
    return context.dispatch(setAction({ name: 'bundleActions', payload }));
  },
});

export const bundleActions = [bundleActionClient, bundleActionServer, bundleAction];
