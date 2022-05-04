import { commandLineListTokens, createApp, createBundle, provide } from '@tramvai/core';
import { CommonModule, ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/module-common';
import { NoSpaRouterModule, PAGE_SERVICE_TOKEN } from '@tramvai/module-router';
import { LogModule } from '@tramvai/module-log';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { HTTP_CLIENT_FACTORY, HttpClientModule } from '@tramvai/module-http-client';
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
    MockerModule,
  ],
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [{ key: 'CONFIG_API', value: 'test' }],
    }),
    provide({
      provide: 'CONFIG_API_HTTP_CLIENT',
      useFactory: ({
        factory,
        envManager,
      }: {
        factory: typeof HTTP_CLIENT_FACTORY;
        envManager: typeof ENV_MANAGER_TOKEN;
      }) => {
        return factory({
          name: 'config-api',
          baseUrl: envManager.get('CONFIG_API'),
        });
      },
      deps: {
        factory: HTTP_CLIENT_FACTORY,
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: MOCKER_CONFIGURATION,
      useValue: async () => ({ apis: ['CONFIG_API'] }),
    }),
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: ({ configService, pageService }) => {
        return async function testApi() {
          if (pageService.getCurrentRoute().name === 'api') {
            await configService.get('/test/');
          }
        };
      },
      deps: {
        configService: 'CONFIG_API_HTTP_CLIENT',
        pageService: PAGE_SERVICE_TOKEN,
      },
    }),
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
