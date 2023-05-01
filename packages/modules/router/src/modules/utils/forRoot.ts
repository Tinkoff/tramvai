import type { Provider } from '@tinkoff/dippy';
import type { Route } from '@tinkoff/router';
import { ROUTES_TOKEN, ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN } from '@tramvai/tokens-router';

export const routerForRoot = (
  routes: Route[],
  options: {
    spaActionsMode?: typeof ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN;
  } = {}
): Provider[] => {
  return [
    {
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: routes,
    },
    options.spaActionsMode && {
      provide: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
      useValue: options.spaActionsMode,
    },
  ].filter(Boolean);
};

type ForRoot<T = any> = (
  routes: Route[],
  options?: {
    spaActionsMode?: typeof ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN;
  }
) => {
  mainModule: T;
  providers: Provider[];
};

// @TODO: tramvai@3 remove in next major release
export const generateForRoot = <T>(mainModule: T): ForRoot<T> => {
  return (routes, options = {}) => {
    return {
      mainModule,
      providers: routerForRoot(routes, options),
    };
  };
};
