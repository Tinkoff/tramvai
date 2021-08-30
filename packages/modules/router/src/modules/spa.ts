import { Module } from '@tramvai/core';
import { Router } from '@tinkoff/router';

import { providers } from './clientCommon';
import { routerClassToken } from './tokens';

import { spaHooks } from './hooks/spa';
import { generateForRoot } from './utils/forRoot';

export const SpaRouterModule = /* @__PURE__ */ Module({
  providers: [
    ...providers,
    ...spaHooks,
    {
      provide: routerClassToken,
      useValue: Router,
    },
  ],
})(
  class SpaRouterModule {
    static forRoot = generateForRoot(SpaRouterModule);
  }
);
