import { declareModule, provide } from '@tramvai/core';
import { Router } from '@tinkoff/router';

import { ROUTER_MODE_TOKEN } from '@tramvai/tokens-router';
import { providers } from './clientCommon';
import { routerClassToken } from './tokens';

import { spaHooks } from './hooks/spa';
import { routerForRoot } from './utils/forRoot';

export const SpaRouterModule = /* @__PURE__ */ declareModule({
  name: 'SpaRouterModule',
  providers: [
    ...providers,
    ...spaHooks,
    provide({
      provide: routerClassToken,
      useValue: Router,
    }),
    provide({
      provide: ROUTER_MODE_TOKEN,
      useValue: 'spa',
    }),
  ],
  extend: {
    forRoot: routerForRoot,
  },
});
