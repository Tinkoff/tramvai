import { Module, provide, Scope } from '@tramvai/core';
import flatten from '@tinkoff/utils/array/flatten';
import type { DispatcherContext, Event, Reducer } from '@tramvai/state';
import { createDispatcher, devTools } from '@tramvai/state';
import {
  STORE_MIDDLEWARE,
  COMBINE_REDUCERS,
  DISPATCHER_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  STORE_TOKEN,
  INITIAL_APP_STATE_TOKEN,
} from '@tramvai/tokens-common';

@Module({
  providers: [
    provide({
      provide: DISPATCHER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ stores }) => createDispatcher({ stores: stores && flatten(stores) }),
      deps: {
        stores: {
          token: COMBINE_REDUCERS,
          optional: true,
        },
      },
    }),
    provide({
      provide: DISPATCHER_CONTEXT_TOKEN,
      scope: Scope.REQUEST,
      useFactory: ({ dispatcher, initialState, middlewares }) => {
        return dispatcher.createContext({}, initialState, [
          devTools.middleware(),
          ...flatten(middlewares || []),
        ]);
      },
      deps: {
        dispatcher: DISPATCHER_TOKEN,
        middlewares: { token: STORE_MIDDLEWARE, optional: true },
        initialState: { token: INITIAL_APP_STATE_TOKEN, optional: true },
      },
    }),
    provide({
      provide: STORE_TOKEN,
      scope: Scope.REQUEST,
      useFactory: ({ dispatcherContext }) => ({
        getState: dispatcherContext.getState.bind(dispatcherContext),
        dispatch: dispatcherContext.dispatch.bind(dispatcherContext),
        subscribe: dispatcherContext.subscribe.bind(dispatcherContext),
      }),
      deps: {
        dispatcherContext: DISPATCHER_CONTEXT_TOKEN,
      },
    }),
  ],
})
export class StateModule {}
