import { createApp, Scope } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { PROXY_CONFIG_TOKEN, ServerModule } from '@tramvai/module-server';
import { LogModule } from '@tramvai/module-log';
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
  ],
  name: 'server',
  modules: [
    CommonModule,
    SpaRouterModule.forRoot([
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
