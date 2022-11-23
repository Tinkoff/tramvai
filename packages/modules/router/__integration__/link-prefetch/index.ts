import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';

createApp({
  name: 'link-prefetch',
  modules: [
    CommonModule,
    RenderModule,
    ServerModule,
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
        config: {
          nestedLayoutComponent: 'nestedLayoutComponent',
        },
      },
      {
        name: 'second',
        path: '/second/',
        config: {
          pageComponent: 'secondPage',
          nestedLayoutComponent: 'nestedLayoutComponent',
        },
      },
      {
        name: 'third',
        path: '/third/',
        config: {
          pageComponent: 'thirdPage',
          nestedLayoutComponent: 'nestedLayoutComponent',
        },
      },
      {
        name: 'out-of-viewport',
        path: '/out-of-viewport/',
        config: {
          pageComponent: 'outOfViewportPage',
          nestedLayoutComponent: 'nestedLayoutComponent',
        },
      },
    ]),
  ],
  providers: [],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ './bundles/default'),
  },
});
