import { declareAction } from '@tramvai/core';
import { setAction } from '../stores/actions';

const payload = typeof window === 'undefined' ? 'server' : 'client';

const pageActionClient = declareAction({
  name: 'pageActionClient',
  fn() {
    return this.dispatch(setAction({ name: 'pageActionsClient', payload }));
  },
  conditions: {
    onlyBrowser: true,
  },
});

const pageActionServer = declareAction({
  name: 'pageActionServer',
  fn() {
    return this.dispatch(setAction({ name: 'pageActionsServer', payload }));
  },
  conditions: {
    onlyServer: true,
  },
});

const pageAction = declareAction({
  name: 'pageAction',
  fn() {
    return this.dispatch(setAction({ name: 'pageActions', payload }));
  },
});

export const pageActions = [pageActionClient, pageActionServer, pageAction];
