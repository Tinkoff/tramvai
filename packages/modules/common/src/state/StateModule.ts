import { Module, Scope } from '@tramvai/core';
import flatten from '@tinkoff/utils/array/flatten';
import type { DispatcherContext, Event, Reducer } from '@tramvai/state';
import { createDispatcher, devTools } from '@tramvai/state';
import {
  STORE_MIDDLEWARE,
  COMBINE_REDUCERS,
  DISPATCHER_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import { INITIAL_APP_STATE_TOKEN } from '../tokens';

@Module({
  providers: [
    {
      provide: DISPATCHER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ stores }) => createDispatcher({ stores: stores && flatten(stores) }),
      deps: {
        stores: {
          token: COMBINE_REDUCERS,
          optional: true,
        },
      },
    },
    {
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
    },
    {
      provide: STORE_TOKEN,
      scope: Scope.REQUEST,
      useFactory: ({ dispatcherContext }: { dispatcherContext: DispatcherContext<any> }) => ({
        getState: (reducer?: Reducer<any>) => dispatcherContext.getState(reducer),
        dispatch: <Payload>(action: Event<Payload>): Payload => dispatcherContext.dispatch(action),
        subscribe: (reducer, callback) => dispatcherContext.subscribe(reducer, callback),
      }),
      deps: {
        dispatcherContext: DISPATCHER_CONTEXT_TOKEN,
      },
    },
  ],
})
export class StateModule {}
