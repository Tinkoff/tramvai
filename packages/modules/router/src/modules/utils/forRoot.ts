import type { Provider } from '@tinkoff/dippy';
import type { Route } from '@tinkoff/router';
import { ROUTES_TOKEN, ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN } from '@tramvai/tokens-router';

type ForRoot<T = any> = (
  routes: Route[],
  options?: {
    spaActionsMode?: typeof ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN;
  }
) => {
  mainModule: T;
  providers: Provider[];
};

export const generateForRoot = <T>(mainModule: T): ForRoot<T> => {
  return (routes, options = {}) => {
    return {
      mainModule,
      providers: [
        {
          provide: ROUTES_TOKEN,
          multi: true,
          useValue: routes,
        },
        options.spaActionsMode && {
          provide: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
          useValue: options.spaActionsMode,
        },
      ].filter(Boolean),
    };
  };
};
