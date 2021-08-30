import { createAction } from '@tramvai/core';
import { setAction } from '../stores/actions';

const payload = typeof window === 'undefined' ? 'server' : 'client';

const pageActionClient = createAction({
  name: 'pageActionClient',
  fn: (context) => {
    return context.dispatch(setAction({ name: 'pageActionsClient', payload }));
  },
  conditions: {
    onlyBrowser: true,
  },
});

const pageActionServer = createAction({
  name: 'pageActionServer',
  fn: (context) => {
    return context.dispatch(setAction({ name: 'pageActionsServer', payload }));
  },
  conditions: {
    onlyServer: true,
  },
});

const pageAction = createAction({
  name: 'pageAction',
  fn: (context) => {
    return context.dispatch(setAction({ name: 'pageActions', payload }));
  },
});

export const pageActions = [pageActionClient, pageActionServer, pageAction];
