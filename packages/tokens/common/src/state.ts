import { createToken } from '@tinkoff/dippy';
import type { DispatcherContext, Event, Middleware, Reducer } from '@tramvai/state';

/**
 * @description
 * dispatcher implementation
 * Реализация dispatcher
 */
export const DISPATCHER_TOKEN = createToken('dispatcher');

/**
 * @description
 * dispatcher context implementation
 */
export const DISPATCHER_CONTEXT_TOKEN = createToken<DispatcherContext<any>>('dispatcherContext');

/**
 * @description
 * Token for adding stores that were created with createReducer
 */
export const COMBINE_REDUCERS = createToken('combineReducers', { multi: true });

/**
 * @description
 * Common app store
 */
export const STORE_TOKEN = createToken<Store>('store');

/**
 * @description
 * Custom middlewares for working with store state
 */
export const STORE_MIDDLEWARE = createToken<Middleware>('storeMiddleware', { multi: true });

export interface Store<State = Record<string, any>> {
  dispatch: <Payload>(actionOrNameEvent: string | Event<Payload>, payload?: Payload) => Payload;

  subscribe(callback: (state: Record<string, any>) => void): () => void;
  subscribe<S>(reducer: Reducer<S>, callback: (state: S) => void): () => void;

  getState(): State;
  getState<S>(reducer: Reducer<S>): S;
}
