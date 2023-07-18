import { createApp, provide } from '@tramvai/core';
import { CommonModule, ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/module-common';
import { RenderModule } from '@tramvai/module-render';
import { SpaRouterModule } from '@tramvai/module-router';
import { ServerModule } from '@tramvai/module-server';
import { ChildAppModule, CHILD_APP_RESOLUTION_CONFIGS_TOKEN } from '@tramvai/module-child-app';
import { HTTP_CLIENT_FACTORY, HttpClientModule } from '@tramvai/module-http-client';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { MockerModule } from '@tramvai/module-mocker';
import { ClientHintsModule } from '@tramvai/module-client-hints';
import { routes } from './routes';
import { FAKE_API_CLIENT } from '../shared/tokens';

createApp({
  name: 'root-app',
  bundles: {
    base: () => import(/* webpackChunkName: "base" */ './bundles/base'),
    'base-not-preloaded': () =>
      import(/* webpackChunkName: "base-not-preloaded" */ './bundles/base-not-preloaded'),
    'client-hints': () => import(/* webpackChunkName: "client-hints" */ './bundles/client-hints'),
    commandline: () => import(/* webpackChunkName: "commandline" */ './bundles/commandline'),
    error: () => import(/* webpackChunkName: "error" */ './bundles/error'),
    'react-query': () => import(/* webpackChunkName: "react-query" */ './bundles/react-query'),
    router: () => import(/* webpackChunkName: "router" */ './bundles/router'),
    state: () => import(/* webpackChunkName: "state" */ './bundles/state'),
  },
  modules: [
    CommonModule,
    RenderModule,
    SpaRouterModule.forRoot(routes),
    ServerModule,
    HttpClientModule,
    ChildAppModule,
    ClientHintsModule,
    ReactQueryModule,
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
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'base-not-preloaded',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'client-hints',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'commandline',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'error',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'header',
          byTag: {
            latest: {
              version: '0.0.0-stub',
            },
          },
        },
        {
          name: 'react-query',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'router',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'state',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              withoutCss: true,
            },
          },
        },
        {
          name: 'footer',
          byTag: {
            latest: {
              version: '0.0.0-stub',
              baseUrl: 'http://localhost:5041/',
            },
          },
        },
      ],
    }),
  ],
});
