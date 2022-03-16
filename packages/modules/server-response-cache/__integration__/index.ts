import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { LogModule } from '@tramvai/module-log';
import { ServerResponseCacheModule } from '@tramvai/module-server-response-cache';
import { bundles } from '../../../../test/shared/common';

createApp({
  name: 'server-response-cache',
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
        name: 'test',
        path: '/test/',
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
    ServerResponseCacheModule,
  ],
  bundles,
});
