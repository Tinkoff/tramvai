import flatten from '@tinkoff/utils/array/flatten';
import type { Container } from '@tinkoff/dippy';
import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { ChildDispatcherContext } from '@tramvai/state';
import { CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN } from '@tramvai/tokens-child-app';
import {
  DISPATCHER_CONTEXT_TOKEN,
  DISPATCHER_TOKEN,
  INITIAL_APP_STATE_TOKEN,
  STORE_MIDDLEWARE,
} from '@tramvai/tokens-common';

export const getChildProviders = (appDi: Container): Provider[] => {
  const parentDispatcherContext = appDi.get(DISPATCHER_CONTEXT_TOKEN);

  return [
    provide({
      provide: DISPATCHER_CONTEXT_TOKEN,
      useFactory: ({ dispatcher, middlewares, initialState, parentAllowedStores }) => {
        return new ChildDispatcherContext({
          dispatcher,
          // context will be set later by the CONTEXT_TOKEN
          context: {},
          initialState,
          middlewares: flatten(middlewares || []),
          parentDispatcherContext,
          parentAllowedStores: flatten(parentAllowedStores || []),
        });
      },
      deps: {
        dispatcher: DISPATCHER_TOKEN,
        middlewares: { token: STORE_MIDDLEWARE, optional: true },
        initialState: { token: INITIAL_APP_STATE_TOKEN, optional: true },
        parentAllowedStores: {
          token: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
          optional: true,
        },
      },
    }),
  ];
};
