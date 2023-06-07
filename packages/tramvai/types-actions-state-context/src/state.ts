import type { AnyEventCreator, EmptyEventCreator, EventCreator1, Event } from './events';
import type { AnyAction, TramvaiAction } from './actions';

export type EmptyEventHandler<State> = (state: State) => State;
export type EventHandler<State, Payload = void> = (state: State, payload: Payload) => State;

export type EventHandlersToEventCreators<
  State,
  Model extends { [K: string]: EventHandler<State, any> }
> = {
  [K in keyof Model]: Model[K] extends EmptyEventHandler<State>
    ? EmptyEventCreator
    : Model[K] extends EventHandler<State, infer Payload>
    ? EventCreator1<Payload>
    : null;
};

/**
 * @deprecated
 */
export type BaseStoreConstructor<State, Name extends string = string> = {
  storeName: Name;
  handlers: Record<string, Function | string>;
  new (dispatcher: any): BaseStore<State>;
};

/**
 * @deprecated
 */
export interface BaseStore<State> {
  state: Readonly<State>;

  hydrateKeys: Record<keyof State, boolean>;

  dispatcher?: Readonly<Record<string, any>>;

  getState(): State;

  dehydrate(): Partial<State> | void;

  rehydrate(state: State): void;
}

export interface ReduceBaseStore<State> {
  getState(): State;
  dehydrate(): Partial<State> | void;
  rehydrate(state: Partial<State> | void): void;
  handle(payload: any, eventName: string, meta?: any): any;
}

export interface Reducer<State, Name extends string = string, Events = any> {
  storeName: Name;

  handlers: Record<string, Function | string>;

  events: Events;

  new (): ReduceBaseStore<State>;

  on<Payload>(
    event: AnyEventCreator<Payload> | string | Array<AnyEventCreator | string>,
    handler: EventHandler<State, Payload>
  ): this;

  /**
   * @deprecated Use object initializer for the createReducer call to define events
   */
  createEvents<Model extends { [K: string]: EventHandler<State, any> }>(
    model: Model
  ): EventHandlersToEventCreators<State, Model>;
}

export type StoreInstance = InstanceType<StoreClass>;

export interface GetState {
  (): Record<string, any>;
  <S>(reducer: Reducer<S>): S;
}

export interface SubscribeHandler {
  (handler: (state: Record<string, any>) => void): () => void;
  <S>(reducer: Reducer<S>, callback: (state: S) => void): () => void;
}

export type Dispatch = <Payload>(event: Event<Payload>) => Payload;

export interface ConsumerContext {
  executeAction<Params extends any[], Result, Deps>(
    action: TramvaiAction<Params, Result, Deps>,
    ...params: Params
  ): Result extends Promise<any> ? Result : Promise<Result>;
  executeAction<Payload = any, Result = any, Deps extends Record<string, any> = any>(
    action: AnyAction<Payload, Result, Deps>,
    payload?: Payload
  ): Promise<Result extends PromiseLike<infer U> ? U : Result>;

  dispatch: <Payload = any>(
    actionOrNameEvent: string | Event<Payload>,
    payload?: Payload
  ) => Promise<Payload>;

  dispatchWith: <
    CreateActionOrType extends (...args: unknown[]) => Event | Event = (
      ...args: unknown[]
    ) => Event | Event,
    Options extends Record<string, any> = Record<string, any>
  >(
    createActionOrType: CreateActionOrType,
    options?: Options
  ) => <Result = any>(...args: any[]) => Promise<Result>;

  getState: GetState;

  /**
   * @deprecated используйте метод `context.getState(reducer)`
   */
  getStore<
    Store extends
      | Reducer<State>
      | BaseStoreConstructor<State>
      | string
      | { store: Reducer<State> | BaseStoreConstructor<State> | string; optional: true },
    State = any
  >(
    store: Store
  ): Store extends Reducer<State> | BaseStoreConstructor<State>
    ? InstanceType<Store>
    : { getState: () => State; setState: (state: State) => void };

  subscribe(callback: (state: Record<string, any>) => void): () => void;
  subscribe<S>(reducer: Reducer<S>, callback: (state: S) => void): () => void;

  hasStore(store: Reducer<any>): boolean;
  registerStore(store: Reducer<any>): void;
  unregisterStore(store: Reducer<any>): void;
}

export interface StoreClass {
  handlers: Record<string, Function | string>;
  storeName: string;
  // TODO: убрать после того отпадёт надобность связывать сторы router и application
  dependencies?: Array<StoreClass | string | { store: StoreClass | string; optional: true }>;
  new (dispatcher: DispatcherContext<any>['dispatcherInterface']): any;
}

export type DispatcherContext<TContext> = {
  getStore<T extends StoreClass>(
    storeClass: T | string | { store: T | string; optional: true }
  ): InstanceType<T> | null;

  getState: GetState;

  subscribe: SubscribeHandler;

  dispatch: Dispatch;

  dispatcherInterface: {
    // deprecated
    getContext: () => TContext;
    // deprecated
    getStore: DispatcherContext<TContext>['getStore'];
  };
};

export interface MiddlewareApi {
  dispatch: Dispatch;
  subscribe: SubscribeHandler;
  getState: GetState;
}

export type Middleware = (api: MiddlewareApi) => (next: Dispatch) => (event: Event) => any;
