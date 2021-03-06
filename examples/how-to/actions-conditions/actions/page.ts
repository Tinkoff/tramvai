import { createAction } from '@tramvai/core';
import { set } from '../store';
import { innerAction, innerBrowserAction, innerServerAction } from './inner';

export const pageServerAction = createAction({
  name: 'pageServerAction',
  fn: async (context) => {
    console.log('execute pageServerAction');
    await context.executeAction(innerAction);
    await context.executeAction(innerServerAction);
    await context.executeAction(innerBrowserAction);
    return context.dispatch(set('pageServerAction'));
  },
  conditions: {
    pageServer: true,
  },
});

export const pageBrowserAction = createAction({
  name: 'pageBrowserAction',
  fn: async (context) => {
    console.log('execute pageBrowserAction');
    await context.executeAction(innerAction);
    await context.executeAction(innerServerAction);
    await context.executeAction(innerBrowserAction);
    return context.dispatch(set('pageBrowserAction'));
  },
  // this action can only be executed on the browser
  conditions: {
    onlyBrowser: true,
  },
});

export const pageAlwaysAction = createAction({
  name: 'pageAlwaysAction',
  fn: async (context) => {
    console.log('execute pageAlwaysAction');
    return context.dispatch(set('pageAlwaysAction'));
  },
  conditions: {
    always: true,
  },
});

// this action is only executed in the browser, on page load and on every SPA transition
export const pageBrowserAlwaysAction = createAction({
  name: 'pageBrowserAlwaysAction',
  fn: async (context) => {
    console.log('execute pageBrowserAlwaysAction');
    return context.dispatch(set('pageBrowserAlwaysAction'));
  },
  conditions: {
    always: true,
    onlyBrowser: true,
  },
});
