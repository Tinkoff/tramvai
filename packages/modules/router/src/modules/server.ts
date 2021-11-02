import { commandLineListTokens, Module } from '@tramvai/core';
import { Router } from '@tinkoff/router';
import {
  REQUEST_MANAGER_TOKEN,
  ACTION_REGISTRY_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
} from '@tramvai/tokens-common';

import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { providers } from './common';
import { routerClassToken } from './tokens';

import { serverGuards } from './guards/server';
import { runActionsFactory } from './hooks/runActions';
import { serverHooks } from './hooks/server';
import { serverTokens } from './tokens/server/index';

import { generateForRoot } from './utils/forRoot';

@Module({
  providers: [
    ...providers,
    ...serverGuards,
    ...serverHooks,
    ...serverTokens,
    {
      provide: routerClassToken,
      useValue: Router,
    },
    {
      provide: commandLineListTokens.resolveUserDeps,
      multi: true,
      useFactory: ({ router, requestManager }) => {
        return function routerInit() {
          return router.navigate(requestManager.getUrl());
        };
      },
      deps: {
        router: ROUTER_TOKEN,
        requestManager: REQUEST_MANAGER_TOKEN,
      },
    },
    {
      // запускаем экшены отдельно от самого роутинга, чтобы распараллелить задачи
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: runActionsFactory,
      deps: {
        router: ROUTER_TOKEN,
        actionRegistry: ACTION_REGISTRY_TOKEN,
        actionPageRunner: ACTION_PAGE_RUNNER_TOKEN,
      },
    },
  ],
})
export class NoSpaRouterModule {
  static forRoot = generateForRoot(NoSpaRouterModule);
}

export const SpaRouterModule = NoSpaRouterModule;
