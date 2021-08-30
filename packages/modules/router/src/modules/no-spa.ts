import { Module } from '@tramvai/core';
import { NoSpaRouter } from '@tinkoff/router';
import { providers } from './clientCommon';
import { generateForRoot } from './utils/forRoot';
import { routerClassToken } from './tokens';

export const NoSpaRouterModule = /* @__PURE__ */ Module({
  providers: [
    ...providers,
    {
      provide: routerClassToken,
      useValue: NoSpaRouter,
    },
  ],
})(
  class NoSpaRouterModule {
    static forRoot = generateForRoot(NoSpaRouterModule);
  }
);
