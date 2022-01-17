import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';
import { bundleActions } from '../actions/bundle';

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'lazy',
  actions: bundleActions,
  components: {
    pageDefault: lazy(() => import('./components/lazy-default')),
    layoutDefault: lazy(() => import('./components/lazy-layout')),
  },
});
