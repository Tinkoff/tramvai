import { createApp, provide } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { RenderModule } from '@tramvai/module-render';
import { SpaRouterModule } from '@tramvai/module-router';
import { ServerModule } from '@tramvai/module-server';
import { ApiClientsModule } from '@tramvai/module-api-clients';
import { MockerModule } from '@tramvai/module-mocker';
import { ChildAppModule, CHILD_APP_RESOLUTION_CONFIGS_TOKEN } from '@tramvai/module-child-app';
import { routes } from './routes';

createApp({
  name: 'root-app',
  bundles: {
    base: () => import(/* webpackChunkName: "base" */ './bundles/base'),
    'base-not-preloaded': () =>
      import(/* webpackChunkName: "base-not-preloaded" */ './bundles/base-not-preloaded'),
    state: () => import(/* webpackChunkName: "state" */ './bundles/state'),
  },
  modules: [
    CommonModule,
    RenderModule,
    SpaRouterModule.forRoot(routes),
    ServerModule,
    ApiClientsModule,
    ChildAppModule,
    MockerModule,
  ],
  providers: [
    provide({
      provide: CHILD_APP_RESOLUTION_CONFIGS_TOKEN,
      multi: true,
      useValue: [
        {
          name: 'base',
          baseUrl: process.env.CHILD_APP_BASE,
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'base-not-preloaded',
          baseUrl: process.env.CHILD_APP_BASE_NOT_PRELOADED,
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'state',
          baseUrl: process.env.CHILD_APP_STATE,
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
      ],
    }),
  ],
});
