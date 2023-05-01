import { commandLineListTokens, declareModule, provide } from '@tramvai/core';
import { Router } from '@tinkoff/router';
import {
  REQUEST_MANAGER_TOKEN,
  ACTION_REGISTRY_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';

import { ROUTER_MODE_TOKEN, ROUTER_TOKEN } from '@tramvai/tokens-router';
import { providers } from './common';
import { routerClassToken } from './tokens';

import { serverGuards } from './guards/server';
import { runActionsFactory } from './hooks/runActions';
import { serverHooks } from './hooks/server';
import { serverTokens } from './tokens/server/index';

import { routerForRoot } from './utils/forRoot';

export const NoSpaRouterModule = declareModule({
  name: 'NoSpaRouterModule',
  providers: [
    ...providers,
    ...serverGuards,
    ...serverHooks,
    ...serverTokens,
    provide({
      provide: routerClassToken,
      useValue: Router,
    }),
    provide({
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
    }),
    provide({
      // запускаем экшены отдельно от самого роутинга, чтобы распараллелить задачи
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: runActionsFactory,
      deps: {
        store: STORE_TOKEN,
        router: ROUTER_TOKEN,
        actionRegistry: ACTION_REGISTRY_TOKEN,
        actionPageRunner: ACTION_PAGE_RUNNER_TOKEN,
      },
    }),
    provide({
      provide: ROUTER_MODE_TOKEN,
      useValue: 'no-spa',
    }),
  ],
  extend: {
    forRoot: routerForRoot,
  },
});

export const SpaRouterModule = declareModule({
  name: 'SpaRouterModule',
  imports: [NoSpaRouterModule],
  providers: [
    provide({
      provide: ROUTER_MODE_TOKEN,
      useValue: 'spa',
    }),
  ],
  extend: {
    forRoot: routerForRoot,
  },
});
