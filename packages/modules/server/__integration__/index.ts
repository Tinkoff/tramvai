import { createApp, provide, Scope } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import {
  LIVENESS_PATH_TOKEN,
  PROXY_CONFIG_TOKEN,
  ServerModule,
  SERVER_MODULE_PAPI_PRIVATE_ROUTE,
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
    {
      provide: LIVENESS_PATH_TOKEN,
      useValue: process.env.CUSTOM_LIVENESS_PATH ?? '/healthz',
    },
    provide({
      provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get',
        path: '/get-cookie',
        async handler({ cookies }) {
          return cookies.test ?? 'no-cookie';
        },
      }),
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'post',
        path: '/post-response',
        handler: async ({ body }) => {
          return body ?? 'no-body';
        },
      }),
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get',
        path: '/long-response',
        handler: async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));

          return 'response';
        },
        options: {
          timeout: 100,
        },
      }),
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'post',
        path: '/schema-validation',
        handler: async ({ body }) => {
          return body.value;
        },
        options: {
          schema: {
            body: {
              type: 'object',
              properties: {
                value: {
                  type: 'number',
                  minimum: 0,
                },
              },
              required: ['value'],
              additionalProperties: false,
            },
          },
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
