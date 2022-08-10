import { declareAction } from '@tramvai/core';
import { set } from '../store';
import { innerAction, innerBrowserAction, innerServerAction } from './inner';

export const pageServerAction = declareAction({
  name: 'pageServerAction',
  async fn() {
    console.log('execute pageServerAction');
    await this.executeAction(innerAction);
    await this.executeAction(innerServerAction);
    await this.executeAction(innerBrowserAction);
    return this.dispatch(set('pageServerAction'));
  },
  conditions: {
    pageServer: true,
  },
});

export const pageBrowserAction = declareAction({
  name: 'pageBrowserAction',
  async fn() {
    console.log('execute pageBrowserAction');
    await this.executeAction(innerAction);
    await this.executeAction(innerServerAction);
    await this.executeAction(innerBrowserAction);
    return this.dispatch(set('pageBrowserAction'));
  },
  // this action can only be executed on the browser
  conditions: {
    onlyBrowser: true,
  },
});

export const pageAlwaysAction = declareAction({
  name: 'pageAlwaysAction',
  async fn() {
    console.log('execute pageAlwaysAction');
    return this.dispatch(set('pageAlwaysAction'));
  },
  conditions: {
    always: true,
  },
});

// this action is only executed in the browser, on page load and on every SPA transition
export const pageBrowserAlwaysAction = declareAction({
  name: 'pageBrowserAlwaysAction',
  async fn() {
    console.log('execute pageBrowserAlwaysAction');
    return this.dispatch(set('pageBrowserAlwaysAction'));
  },
  conditions: {
    always: true,
    onlyBrowser: true,
  },
});
