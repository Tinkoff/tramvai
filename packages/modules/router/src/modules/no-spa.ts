import { declareModule, provide } from '@tramvai/core';
import { NoSpaRouter } from '@tinkoff/router';
import { ROUTER_MODE_TOKEN } from '@tramvai/tokens-router';
import { providers } from './clientCommon';
import { routerForRoot } from './utils/forRoot';
import { routerClassToken } from './tokens';

export const NoSpaRouterModule = /* @__PURE__ */ declareModule({
  name: 'NoSpaRouterModule',
  providers: [
    ...providers,
    provide({
      provide: routerClassToken,
      useValue: NoSpaRouter,
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
