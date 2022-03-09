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

import { runActionsFactory } from './hooks/runActions';

export const providers: Provider[] = [
  ...commonProviders,
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ router, store, renderMode }) => {
      return async function routerInit() {
        const currentRoute = store.getState(RouterStore).currentRoute as NavigationRoute;

        // in client-side rendering mode, run navigation before hydration,
        // because currentRoute from initialState can be undefined or incorrect
        if (renderMode === 'client') {
          await router.navigate(window.location.href);
        }

        return router.rehydrate({
          to: currentRoute,
        });
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      store: STORE_TOKEN,
      renderMode: TRAMVAI_RENDER_MODE,
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
      // in client-side rendering mode, action already was executed
      if (deps.renderMode === 'client') {
        return;
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
];
