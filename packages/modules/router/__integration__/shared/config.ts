import type { Route } from '@tinkoff/router';

export const routes: Route[] = [
  {
    name: 'root',
    path: '/',
  },
  {
    name: 'test',
    path: '/test/',
    config: {
      bundle: 'test',
    },
  },
  {
    name: 'lazy',
    path: '/lazy/',
    config: {
      bundle: 'lazy',
    },
  },
  {
    name: 'dynamic',
    path: '/dynamic/:id/',
  },
  {
    name: 'inner-page',
    path: '/inner/page/',
  },
  {
    name: 'pageWithActions',
    path: '/actions/',
    config: {
      pageComponent: 'pageWithActions',
    },
  },
  {
    name: '202',
    path: '/status-202/',
    config: {
      httpStatus: 202,
    },
  },
  {
    name: '501',
    path: '/status-501/',
    config: {
      httpStatus: 501,
    },
  },
  {
    name: 'after-static-redirect',
    path: '/after/static/redirect/',
  },
  {
    name: 'redirect',
    path: '/redirect/',
    redirect: '/after/static/redirect/',
  },
  {
    name: 'redirect-code',
    path: '/redirect/code',
    redirect: {
      url: '/after/static/redirect',
      code: 301,
    },
  },
  {
    name: 'redirect-preserve-query',
    path: '/redirect/query/',
    redirect: {
      url: '/after/static/redirect',
      preserveQuery: true,
    },
  },
  {
    name: 'redirect-absolute',
    path: '/redirect/absolute/',
    redirect: {
      url: 'https://www.tinkoff.ru/redirect/',
    },
  },
  {
    name: 'after-commandline-redirect',
    path: '/after/commandline/redirect/',
  },
  {
    name: 'redirect-commandline',
    path: '/redirect/commandline',
  },
  {
    name: 'after-action-redirect',
    path: '/after/action/redirect/',
  },
  {
    name: 'action-redirect',
    path: '/action/redirect/',
    config: {
      bundle: 'action-redirect',
    },
  },
  {
    name: 'action-redirect-with-code',
    path: '/action/redirect/code/',
    config: {
      bundle: 'action-redirect',
    },
  },
  {
    name: 'guard-redirect',
    path: '/redirect/guard/',
    config: {
      guardRedirect: '/test/',
    },
  },
  {
    name: 'use-route-1',
    path: '/useroute/1/',
    config: {
      bundle: 'use-route',
    },
  },
  {
    name: 'use-route-2',
    path: '/useroute/2/',
    config: {
      bundle: 'use-route',
    },
  },
  {
    name: 'use-route-3',
    path: '/useroute/3/',
    config: {
      bundle: 'use-route',
    },
  },
  {
    name: 'window-history-replace-state-internal',
    path: '/history/replace-state/internal/',
    config: {
      bundle: 'history',
      pageComponent: 'ReplaceStateInternal',
    },
  },
  {
    name: 'window-history-replace-state-external',
    path: '/history/replace-state/external/',
    config: {
      bundle: 'history',
      pageComponent: 'ReplaceStateExternal',
    },
  },
  {
    name: 'window-history-push-state-internal',
    path: '/history/push-state/internal/',
    config: {
      bundle: 'history',
      pageComponent: 'PushStateInternal',
    },
  },
  {
    name: 'window-history-push-state-external',
    path: '/history/push-state/external/',
    config: {
      bundle: 'history',
      pageComponent: 'PushStateExternal',
    },
  },
  {
    name: 'dom-navigate-link-query',
    path: '/dom/navigate/query/',
    config: {
      bundle: 'dom-navigate',
      pageComponent: 'DomNavigateQuery',
    },
  },
  {
    name: 'dom-navigate-link-hash',
    path: '/dom/navigate/hash/',
    config: {
      bundle: 'dom-navigate',
      pageComponent: 'DomNavigateHash',
    },
  },
  ...(process.env.TEST_NOT_FOUND
    ? [
        {
          name: 'not-found',
          path: '*',
          config: {
            pageComponent: 'notFound',
            httpStatus: 409,
          },
        },
      ]
    : []),
];
