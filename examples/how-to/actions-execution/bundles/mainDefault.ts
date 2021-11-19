import { createBundle } from '@tramvai/core';
import { store } from '../store';
import { bundleInLimit, bundleOutLimit } from '../actions/bundle';
import { Page } from '../components/Page';

export const mainDefault = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
  },
  // let's specify our store, so that it will immediately initialize and subscribe to its dispatch events
  reducers: [store],
  // the actions can be specified as part of the bundle - then these actions will be executed for all pages of the bundle
  actions: [bundleInLimit, bundleOutLimit],
});
