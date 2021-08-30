import { createApp, provide } from '@tramvai/core';
import { HttpClientModule } from '@tramvai/module-http-client';
import { COMBINE_REDUCERS, CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule, SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/module-server';
import { createPapiMethod } from '@tramvai/papi';
import { testPapiReducer } from './reducers/testPapi';

createApp({
  name: 'http-client',
  modules: [
    CommonModule,
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'http-client-papi',
        path: '/http-client-papi',
        config: {
          pageComponent: 'http-client-papi',
        },
      },
    ]),
    RenderModule,
    ServerModule,
    HttpClientModule,
  ],
  providers: [
    provide({
      provide: COMBINE_REDUCERS,
      useValue: testPapiReducer,
      multi: true,
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: () => {
        return createPapiMethod({
          method: 'get',
          path: '/async-papi-server',
          async handler() {
            return 'async-papi-server';
          },
        });
      },
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: () => {
        return createPapiMethod({
          method: 'get',
          path: '/sync-papi-server',
          handler() {
            return 'sync-papi-server';
          },
        });
      },
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: () => {
        return createPapiMethod({
          method: 'get',
          path: '/async-papi-browser',
          async handler() {
            return 'async-papi-browser';
          },
        });
      },
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: () => {
        return createPapiMethod({
          method: 'get',
          path: '/sync-papi-browser',
          handler() {
            return 'sync-papi-browser';
          },
        });
      },
    }),
  ],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault'),
  },
});
