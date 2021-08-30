import { createApp, Scope } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { RouterSpaModule } from '@tramvai/module-route-spa';
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
        target: `http://localhost:${process.env.EXTERNAL_WEBSITE_PORT}/to/`,
      },
      multi: true,
    },
  ],
  name: 'server',
  modules: [
    CommonModule,
    RouterSpaModule.forRoot([
      {
        name: 'root',
        path: '/from/',
        properties: {
          bundle: 'root',
          pageComponent: 'page',
          layoutComponent: 'layout',
        },
      },
      {
        name: 'test',
        path: '/to/',
        properties: {
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
