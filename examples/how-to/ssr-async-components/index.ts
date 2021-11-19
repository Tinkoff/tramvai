import { createApp, createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';
import { modules } from '../common';

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    // wrap the import in a lazy call so that the component is successfully rendered on the server
    // and the scripts/styles for the component are preloaded on the client
    pageDefault: lazy(() => import('./pages/page')),
  },
});

createApp({
  name: 'ssr-async-components',
  modules: [...modules],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
