import noop from '@tinkoff/utils/function/noop';
import type { NavigationRoute } from '@tinkoff/router';
import type { Provider } from '@tramvai/core';
import { commandLineListTokens, provide } from '@tramvai/core';
import {
  STORE_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  ACTION_REGISTRY_TOKEN,
  ENV_MANAGER_TOKEN,
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
    useFactory: ({ router, store, envManager }) => {
      return async function routerInit() {
        // run full navigation flow for CSR fallback on application start
        if (envManager.get('TRAMVAI_FORCE_CLIENT_SIDE_RENDERING') === 'true') {
          router.start();
          return router.navigate({ url: window.location.href, replace: true });
        }

        const currentRoute = store.getState(RouterStore).currentRoute as NavigationRoute;

        return router.rehydrate({
          to: currentRoute,
        });
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      store: STORE_TOKEN,
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
  provide({
    // после выполнения надо включить исполнение роутинга, чтобы регидрация рендера реакта прошла успешно
    // после этого уже можно будет делать переходы и т.д.
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: ({ router, store, envManager }) => {
      return function routerStart() {
        // router already started for CSR fallback on this stage
        if (envManager.get('TRAMVAI_FORCE_CLIENT_SIDE_RENDERING') === 'true') {
          return;
        }

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
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
  provide({
    // при первой загрузке страницы мы должны выполнить экшены уже после того произошла регидрация
    // рендера реакта, т.к. экшены могут повлиять на рендер
    provide: commandLineListTokens.clear,
    multi: true,
    useFactory: (deps) => {
      // actions already executed for CSR fallback before this stage
      if (deps.envManager.get('TRAMVAI_FORCE_CLIENT_SIDE_RENDERING') === 'true') {
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
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
];
