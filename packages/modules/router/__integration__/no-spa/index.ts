import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NoSpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { providers } from '../shared/providers';
import { routes } from '../shared/config';

createApp({
  name: 'router',
  modules: [CommonModule, RenderModule, ServerModule, NoSpaRouterModule.forRoot(routes)],
  providers,
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ '../shared/bundles/default'),
    test: () => import(/* webpackChunkName: "test" */ '../shared/bundles/testBundle'),
    lazy: () => import(/* webpackChunkName: "lazy" */ '../shared/bundles/lazy'),
    'action-redirect': () =>
      import(/* webpackChunkName: 'action-redirect' */ '../shared/bundles/action-redirect'),
    'use-route': () => import(/* webpackChunkName: "use-route" */ '../shared/bundles/use-route'),
    history: () => import(/* webpackChunkName: "history" */ '../shared/bundles/history'),
    'dom-navigate': () =>
      import(/* webpackChunkName: "dom-navigate" */ '../shared/bundles/dom-navigate'),
    'bundle-reducer': () =>
      import(/* webpackChunkName: "bundle-reducer" */ '../shared/bundles/bundle-reducer'),
  },
});
