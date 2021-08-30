import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';
import { bundleActions } from '../actions/bundle';

export default createBundle({
  name: 'lazy',
  actions: bundleActions,
  components: {
    pageDefault: lazy(() => import('./components/lazy-default')),
    layoutDefault: lazy(() => import('./components/lazy-layout')),
  },
});
