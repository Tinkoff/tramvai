import type { AnyEventCreator, EmptyEventCreator, EventCreator1, Event } from './events';
import type { AnyAction } from './actions';

export type EventHandler<State, Payload = void> = (state: State, payload: Payload) => State;

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

export interface Reducer<State, Name extends string = string> {
  storeName: Name;

  handlers: Record<string, Function | string>;

  new (): ReduceBaseStore<State>;

  on<Payload>(
    event: AnyEventCreator<Payload> | string | Array<AnyEventCreator | string>,
    handler: EventHandler<State, Payload>
  ): this;

  createEvents<Model extends { [K: string]: EventHandler<State, any> }>(
    model: Model
  ): {
    [K in keyof Model]: Model[K] extends EventHandler<State, void>
      ? EmptyEventCreator
      : Model[K] extends EventHandler<State, infer Payload>
      ? EventCreator1<Payload, Payload>
      : null;
  };
}

export interface ConsumerContext {
  executeAction<Payload extends any = any, Result = any, Deps extends Record<string, any> = any>(
    action: AnyAction<Payload, Result, Deps>,
    payload?: Payload
  ): Promise<Result extends PromiseLike<infer U> ? U : Result>;

  dispatch: <Payload extends any = any>(
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
  ) => <Result extends any = any>(...args: any[]) => Promise<Result>;

  getState(): Record<string, any>;
  getState<S>(reducer: Reducer<S>): S;

  /**
   * @deprecated используйте метод `context.getState(reducer)`
   */
  getStore<
    Store extends
      | Reducer<State>
      | BaseStoreConstructor<State>
      | string
      | { store: Reducer<State> | BaseStoreConstructor<State> | string; optional: true },
    State extends any = any
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
