import type { NavigationRoute } from '@tinkoff/router';
import type { Provider } from '@tramvai/core';
import { commandLineListTokens, provide } from '@tramvai/core';
import {
  STORE_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  ACTION_REGISTRY_TOKEN,
} from '@tramvai/tokens-common';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { RouterStore, setCurrentNavigation, setUrlOnRehydrate } from '../stores/RouterStore';
import { providers as commonProviders } from './common';

import { runActionsFactory } from './hooks/runActions';

export const providers: Provider[] = [
  ...commonProviders,
  provide({
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({ router, store }: { router: typeof ROUTER_TOKEN; store: typeof STORE_TOKEN }) => {
      return function routerInit() {
        return router.rehydrate({
          // @todo разобраться, почему не подходит тип Route
          to: store.getState(RouterStore).currentRoute as NavigationRoute,
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
    useFactory: runActionsFactory,
    deps: {
      router: ROUTER_TOKEN,
      actionRegistry: ACTION_REGISTRY_TOKEN,
      actionPageRunner: ACTION_PAGE_RUNNER_TOKEN,
    },
  }),
];
