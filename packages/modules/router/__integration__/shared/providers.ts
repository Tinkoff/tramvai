import noop from '@tinkoff/utils/function/noop';
import type { Provider } from '@tramvai/core';
import { provide, commandLineListTokens } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN, ROUTER_GUARD_TOKEN, ROUTER_TOKEN } from '@tramvai/tokens-router';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';
import { ActionsStore } from './stores/actions';

declare global {
  interface Window {
    __LATEST_NAVIGATION_TYPE__?: string;
    contextExternal: any;
  }
}

export const providers: Provider[] = [
  { provide: COMBINE_REDUCERS, multi: true, useValue: [ActionsStore] },
  {
    provide: ROUTER_GUARD_TOKEN,
    multi: true,
    useValue: async ({ to }) => {
      if (to.config.guardRedirect) {
        return to.config.guardRedirect;
      }
    },
  },
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ router }) => {
      if (typeof window !== 'undefined') {
        router.registerSyncHook('change', ({ type }) => {
          window.__LATEST_NAVIGATION_TYPE__ = type;
        });
      }

      return noop;
    },
    deps: {
      router: ROUTER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ pageService }) => {
      return () => {
        if (
          typeof window !== 'undefined' &&
          pageService.getCurrentUrl().pathname === '/redirect/commandline/'
        ) {
          return pageService.navigate('/after/commandline/redirect/');
        }
      };
    },
    deps: {
      pageService: PAGE_SERVICE_TOKEN,
    },
  }),
];
