import type { ROUTES_TOKEN } from '@tramvai/module-router';

export const routes: typeof ROUTES_TOKEN & any[] = [
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
    name: 'react-query',
    path: '/react-query',
    config: {
      bundle: 'react-query',
    },
  },
  {
    name: 'error',
    path: '/error',
    config: {
      bundle: 'error',
    },
  },
];
