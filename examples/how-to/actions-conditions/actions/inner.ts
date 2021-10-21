import { createAction } from '@tramvai/core';
import { set } from '../store';

export const innerAction = createAction({
  name: 'innerAction',
  fn: (context) => {
    console.log('execute innerAction');
    return context.dispatch(set('innerAction'));
  },
  // conditions not set - the action will be executed by default:
  // if the action is defined as global (in an application, bundle or page),
  // then the action will first try to execute on the server - if it succeeds, then it will not be executed again on the client
  // if the action did not manage to be executed within the limit, then it will be launched on the client,
  // repeated launches when switching to the page with this action will not be executed, because the last successful execution is remembered
  // if the action is called explicitly through the context, then such an action will always be executed (the execution limit still affects,
  // and the data may not always be available with ssr, but the action will always try to execute)
});

export const innerServerAction = createAction({
  name: 'innerServerAction',
  fn: (context) => {
    console.log('execute innerServerAction');
    return context.dispatch(set('innerServerAction'));
  },
  // this action can only be executed on the server
  conditions: {
    onlyServer: true,
  },
});

export const innerBrowserAction = createAction({
  name: 'innerBrowserAction',
  fn: (context) => {
    console.log('execute innerBrowserAction');
    return context.dispatch(set('innerBrowserAction'));
  },
  // this action can only be executed on the browser
  conditions: {
    onlyBrowser: true,
  },
});
