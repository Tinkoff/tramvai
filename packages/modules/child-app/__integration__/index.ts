import { createApp, provide } from '@tramvai/core';
import { CommonModule, ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/module-common';
import { RenderModule } from '@tramvai/module-render';
import { SpaRouterModule } from '@tramvai/module-router';
import { ServerModule } from '@tramvai/module-server';
import { ApiClientsModule, HTTP_CLIENT_FACTORY } from '@tramvai/module-api-clients';
import { MockerModule } from '@tramvai/module-mocker';
import { ChildAppModule, CHILD_APP_RESOLUTION_CONFIGS_TOKEN } from '@tramvai/module-child-app';
import { routes } from './routes';
import { FAKE_API_CLIENT } from './tokens';

createApp({
  name: 'root-app',
  bundles: {
    base: () => import(/* webpackChunkName: "base" */ './bundles/base'),
    'base-not-preloaded': () =>
      import(/* webpackChunkName: "base-not-preloaded" */ './bundles/base-not-preloaded'),
    state: () => import(/* webpackChunkName: "state" */ './bundles/state'),
    'react-query': () => import(/* webpackChunkName: "react-query" */ './bundles/react-query'),
    error: () => import(/* webpackChunkName: "error" */ './bundles/error'),
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
    {
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'FAKE_API',
          value: 'https://fake-api.com/',
        },
      ],
    },
    {
      provide: FAKE_API_CLIENT,
      useFactory: ({ factory, envManager }) => {
        return factory({
          name: 'fake-api',
          baseUrl: envManager.get('FAKE_API'),
        });
      },
      deps: {
        factory: HTTP_CLIENT_FACTORY,
        envManager: ENV_MANAGER_TOKEN,
      },
    },
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
        {
          name: 'react-query',
          baseUrl: process.env.CHILD_APP_REACT_QUERY,
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'fail-url',
          baseUrl: 'http://localhost:4555',
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
