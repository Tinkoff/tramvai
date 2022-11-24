import noop from '@tinkoff/utils/function/noop';
import type { NavigationRoute } from '@tinkoff/router';
import type { Provider } from '@tramvai/core';
import { commandLineListTokens, provide } from '@tramvai/core';
import {
  STORE_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  ACTION_REGISTRY_TOKEN,
} from '@tramvai/tokens-common';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';
import { RouterStore, setUrlOnRehydrate } from '../stores/RouterStore';
import { providers as commonProviders } from './common';
import { clientTokens } from './tokens/browser/index';

import { runActionsFactory } from './hooks/runActions';

export const providers: Provider[] = [
  ...clientTokens,
  ...commonProviders,
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ router, store }) => {
      return async function routerInit() {
        const currentRoute = store.getState(RouterStore).currentRoute as NavigationRoute;

        return router.rehydrate({
          to: currentRoute,
        });
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      store: STORE_TOKEN,
    },
  }),
  provide({
    // после выполнения надо включить исполнение роутинга, чтобы регидрация рендера реакта прошла успешно
    // после этого уже можно будет делать переходы и т.д.
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: ({ router, store }) => {
      return function routerStart() {
        const routerState = store.getState().router;

        if (routerState.currentUrl.href !== window.location.href) {
          store.dispatch(setUrlOnRehydrate(router.getCurrentUrl()));
        }

        return router.start();
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      store: STORE_TOKEN,
    },
  }),
  provide({
    // при первой загрузке страницы мы должны выполнить экшены уже после того произошла регидрация
    // рендера реакта, т.к. экшены могут повлиять на рендер
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: (deps) => {
      const currentRoute = deps.store.getState(RouterStore).currentRoute as NavigationRoute;

      // in client-side rendering mode, action will be executed on first navigation
      if (
        deps.renderMode === 'client' &&
        (!currentRoute || (currentRoute && currentRoute.actualPath !== window.location.pathname))
      ) {
        return noop;
      }
      return runActionsFactory(deps);
    },
    deps: {
      store: STORE_TOKEN,
      router: ROUTER_TOKEN,
      actionRegistry: ACTION_REGISTRY_TOKEN,
      actionPageRunner: ACTION_PAGE_RUNNER_TOKEN,
      renderMode: TRAMVAI_RENDER_MODE,
    },
  }),
  provide({
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: ({ store, router, renderMode }) => {
      return async function csrFirstNavigation() {
        const currentRoute = store.getState(RouterStore).currentRoute as NavigationRoute;

        // in client-side rendering mode, if current route inconsistent with current location,
        // run navigation to current location.
        if (
          renderMode === 'client' &&
          (!currentRoute || (currentRoute && currentRoute.actualPath !== window.location.pathname))
        ) {
          // replace because otherwice we will push in the history the same url twice,
          // and history.back will return to the same url
          return router.navigate({ url: window.location.href, replace: true });
        }
      };
    },
    deps: {
      store: STORE_TOKEN,
      router: ROUTER_TOKEN,
      renderMode: TRAMVAI_RENDER_MODE,
    },
  }),
];
