import { commandLineListTokens, createApp, createBundle, provide } from '@tramvai/core';
import { CommonModule, ENV_USED_TOKEN } from '@tramvai/module-common';
import { NoSpaRouterModule, PAGE_SERVICE_TOKEN } from '@tramvai/module-router';
import { LogModule } from '@tramvai/module-log';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { ADMIN_SERVICE, HttpClientModule, AdminClientsModule } from '@tramvai/module-api-clients';
import { MockerModule, MOCKER_CONFIGURATION } from '@tramvai/module-mocker';

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: () => 'fake app',
    secondPage: () => 'second page',
  },
});

export const app = createApp({
  name: 'fake-app',
  modules: [
    CommonModule,
    ServerModule,
    RenderModule,
    LogModule,
    NoSpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'second',
        path: '/second/',
        config: {
          pageComponent: 'secondPage',
        },
      },
      {
        name: 'api',
        path: '/api',
      },
    ]),
    HttpClientModule,
    AdminClientsModule,
    MockerModule,
  ],
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [{ key: 'CONFIG_API', value: 'test' }],
    }),
    provide({
      provide: MOCKER_CONFIGURATION,
      useValue: async () => ({ apis: ['CONFIG_API'] }),
    }),
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: ({ adminService, pageService }) => {
        return async function testApi() {
          if (pageService.getCurrentRoute().name === 'api') {
            await adminService.get('/test/');
          }
        };
      },
      deps: {
        adminService: ADMIN_SERVICE,
        pageService: PAGE_SERVICE_TOKEN,
      },
    }),
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
