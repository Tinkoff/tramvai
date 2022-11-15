import type { ROUTES_TOKEN } from '@tramvai/module-router';

export const routes: typeof ROUTES_TOKEN = [
  {
    name: 'base',
    path: '/base',
    config: {
      bundle: 'base',
    },
  },
  {
    name: 'base-not-preloaded',
    path: '/base-not-preloaded',
    config: {
      bundle: 'base-not-preloaded',
    },
  },
  {
    name: 'state',
    path: '/state',
    config: {
      bundle: 'state',
    },
  },
  {
    name: 'error-unknown',
    path: '/error/unknown',
    config: {
      bundle: 'error',
    },
  },
];
