import type { ExtractTokenType } from '@tinkoff/dippy';
import type { ROUTES_TOKEN } from '@tramvai/module-router';

export const routes: ExtractTokenType<typeof ROUTES_TOKEN> & any[] = [
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
    name: 'client-hints',
    path: '/client-hints',
    config: {
      bundle: 'client-hints',
    },
  },
  {
    name: 'commandline',
    path: '/commandline',
    config: {
      bundle: 'commandline',
    },
  },
  {
    name: 'error',
    path: '/error',
    config: {
      bundle: 'error',
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
    name: 'router',
    path: '/router',
    config: {
      bundle: 'router',
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
