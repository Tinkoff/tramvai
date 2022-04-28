import { createApp, provide, Scope } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import {
  PROXY_CONFIG_TOKEN,
  ServerModule,
  SERVER_MODULE_PAPI_PUBLIC_ROUTE,
} from '@tramvai/module-server';
import { LogModule } from '@tramvai/module-log';
import { createPapiMethod } from '@tramvai/papi';
import { bundles } from '../../../../test/shared/common';

createApp({
  providers: [
    {
      provide: PROXY_CONFIG_TOKEN,
      scope: Scope.SINGLETON,
      useValue: {
        context: '/from/',
        target: `http://localhost:${process.env.EXTERNAL_WEBSITE_PORT ?? 3000}/to/`,
      },
      multi: true,
    },
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get',
        path: '/get-response',
        handler: async (req, res) => {
          return { ok: true };
        },
      }),
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'post',
        path: '/post-response',
        handler: async (req, res) => {
          return req.body;
        },
      }),
    }),
  ],
  name: 'server',
  modules: [
    CommonModule,
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
        config: {
          bundle: 'root',
          pageComponent: 'page',
          layoutComponent: 'layout',
        },
      },
      {
        name: 'root',
        path: '/from/',
        config: {
          bundle: 'root',
          pageComponent: 'page',
          layoutComponent: 'layout',
        },
      },
      {
        name: 'test',
        path: '/to/',
        config: {
          bundle: 'test',
          pageComponent: 'page',
          layoutComponent: 'layout',
        },
      },
    ]),
    RenderModule,
    ServerModule,
    LogModule,
  ],
  bundles,
});
