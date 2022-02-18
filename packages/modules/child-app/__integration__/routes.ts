import type { ROUTES_TOKEN } from '@tramvai/module-router';

export const routes: typeof ROUTES_TOKEN[] = [
  {
    name: 'base',
    path: '/base',
    config: {
      bundle: 'base',
    },
  },
  {
    name: 'state',
    path: '/state',
    config: {
      bundle: 'state',
    },
  },
];
