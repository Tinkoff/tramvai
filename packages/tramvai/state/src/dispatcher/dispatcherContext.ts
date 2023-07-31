import compose from '@tinkoff/utils/function/compose';

import type { Dispatcher } from './dispatcher';
import type { Event } from '../createEvent/createEvent.h';
import type { StoreClass, StoreInstance } from '../typings';
import type { Middleware } from './dispatcher.h';
import { subscribe } from './storeSubscribe';
import { SimpleEmitter } from '../stores/SimpleEmitter';
import type { Reducer } from '../createReducer/createReducer.h';

type InitialState = { stores: Record<string, any> };
type Handlers = Dispatcher['handlers'];
type StoreHandler = Handlers[string][number];

const eventExecutor = <P>(event: Event<P>, handlerFns: Record<string, Function>) => {
  const keys = Object.keys(handlerFns);

  for (let index = 0; index < keys.length; index++) {
    const storeName = keys[index];

    const handlerFn = handlerFns[storeName];

    if (!handlerFn) {
      throw new Error(`${storeName} does not have a handler for action ${event.type}`);
    }

    handlerFn(event.payload, event.type);
  }
};

// Конвертация старого типа экшенов в новый
export const convertAction = (actionOrNameEvent: string | Event<any>, payload?: any) => {
  if (typeof actionOrNameEvent === 'string') {
    return {
      payload,
      type: actionOrNameEvent,
      error: false,
    };
  }
  return actionOrNameEvent;
};

// Это форкнутый вариант dispatchr
export class DispatcherContext<TContext> extends SimpleEmitter {
  dispatcher: Dispatcher;

  storeInstances: Record<StoreClass['storeName'], StoreInstance>;

  storeUnsubscribeCallbacks: Record<StoreClass['storeName'], Function>;

  dispatcherInterface: {
    // deprecated
    getContext: () => TContext;
    // deprecated
    getStore: DispatcherContext<TContext>['getStore'];
  };

  rehydratedStoreState: Record<string, any>;

  // eslint-disable-next-line react/static-property-placement
  context: TContext;

  protected fullState: Record<string, any>;

  applyDispatch = <Payload>(event: Event<Payload>) => {
    let eventHandlers = this.dispatcher.handlers[event.type] || [];

    if (!eventHandlers.length) {
      if (event.store) {
        this.registerStore(event.store);
        eventHandlers = this.dispatcher.handlers[event.type] || [];
      } else {
        if (process.env.NODE_ENV === 'development') {
          // fallback to previous versions of createEvent
          console.warn(`
The event "${event.type}" has been dispatched, but no reducers for this event were registered.
Have you forgot to register reducer or add event handler in existing reducer?
`);
        }

        return event.payload;
      }
    }

    this.applyHandlers(event, eventHandlers);

    return event.payload;
  };

  /**
   * @param context The context to be used for store instances
   */
  constructor(
    dispatcher: Dispatcher,
    context: TContext,
    initialState: InitialState,
    middlewares?: Middleware[]
  ) {
    super();
    this.dispatcher = dispatcher;
    this.storeInstances = {};
    this.storeUnsubscribeCallbacks = {};
    this.context = context;
    this.dispatcherInterface = {
      getContext: () => this.context,
      getStore: this.getStore.bind(this),
    };
    this.rehydratedStoreState = {};
    this.fullState = {};

    // Заполняем стейт данными
    if (initialState) {
      this.rehydrate(initialState);
    }

    if (middlewares?.length) {
      this.applyDispatch = this.applyMiddlewares(middlewares);
    }

    // Инцииализируем уже имеющиеся сторы
    Object.keys(this.dispatcher.stores).forEach((store) => {
      this.getStore(store);
    });
  }

  applyMiddlewares(middlewares: Middleware[]) {
    let dispatch = (...args: any[]) => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.'
      );
    };
    const api = {
      getState: this.getState.bind(this),
      subscribe: this.subscribe.bind(this),
      dispatch: (...args: any[]) => dispatch(...args),
    };

    dispatch = compose(...middlewares.map((middleware) => middleware(api)))(this.applyDispatch);

    return dispatch;
  }

  protected storeSubscribe(storeName: string, storeInstance: StoreInstance) {
    const subscribeHandler = () => {
      const newState = storeInstance.getState();

      if (newState !== this.fullState[storeName]) {
        this.fullState = {
          ...this.fullState,
          [storeName]: newState,
        };
        this.emit('change');
      }
    };

    subscribe(storeInstance, subscribeHandler);

    const unsubscribe = () => {
      storeInstance.off('change', subscribeHandler);
    };

    this.storeUnsubscribeCallbacks[storeName] = unsubscribe;
  }

  /**
   * @deprecated
   *
   * Returns a single store instance and creates one if it doesn't already exist
   * @param storeClass The name of the instance
   * @returns The store instance
   * @throws {Error} if store is not registered
   */
  getStore<T extends StoreClass>(storeClass: {
    store: T | string;
    optional: true;
  }): InstanceType<T> | null;

  getStore<T extends StoreClass>(storeClass: T | string): InstanceType<T>;

  getStore<T extends StoreClass>(
    storeClass: T | string | { store: T | string; optional: true }
  ): InstanceType<T> | null;

  // eslint-disable-next-line max-statements
  getStore<T extends StoreClass>(
    storeClass: T | string | { store: T | string; optional: true }
  ): InstanceType<T> | null {
    let storeClassPrepared;
    let optional = false;

    if (typeof storeClass === 'object') {
      storeClassPrepared = storeClass.store;
      optional = storeClass.optional;
    } else {
      storeClassPrepared = storeClass;
    }

    const storeName = this.dispatcher.getStoreName(storeClassPrepared);

    if (!this.storeInstances[storeName]) {
      let Store = this.dispatcher.stores[storeName];

      if (!Store) {
        if (typeof storeClassPrepared === 'function') {
          this.dispatcher.registerStore(storeClassPrepared);
          Store = storeClassPrepared;
        } else {
          if (optional) {
            return null;
          }
          throw new Error(`Store ${storeName} was not registered.`);
        }
      }
      const storeInstance = new Store(this.dispatcherInterface);
      this.storeInstances[storeName] = storeInstance;

      if (this.rehydratedStoreState && this.rehydratedStoreState[storeName]) {
        const state = this.rehydratedStoreState[storeName];

        if (storeInstance.rehydrate) {
          storeInstance.rehydrate(state);
        }
        this.rehydratedStoreState[storeName] = null;
      }

      this.storeSubscribe(storeName, storeInstance);

      // TODO: убрать после того отпадёт надобность связывать сторы router и application
      if (Store.dependencies) {
        Store.dependencies.forEach((dependencyStoreClass) => {
          const dependency = this.getStore(dependencyStoreClass);

          subscribe(dependency, () => {
            storeInstance.emit('change');
          });
        });
      }
    }

    return this.storeInstances[storeName];
  }

  /**
   * Dispatches a new action or throws if one is already in progress
   * @param eventOrType Name of the event to be dispatched
   * @param payload Parameters to describe the action
   * @throws {Error} if store has handler registered that does not exist
   */
  dispatch<Payload>(eventOrType: string | Event<Payload>, payload?: Payload) {
    if (!eventOrType) {
      throw new Error(`eventOrType parameter ${eventOrType} is invalid.`);
    }

    // конвертим старый тип экшенов
    const event: Event<Payload> = convertAction(eventOrType, payload);

    return this.applyDispatch(event);
  }

  applyHandlers<P>(action: Event<P>, handlers: Handlers[string]) {
    const handlerFns: Record<string, Function> = {};

    const storeInstanceGet = (store: StoreHandler) => {
      if (handlerFns[store.name]) {
        // Don't call the default if the store has an explicit action handler
        return;
      }
      const storeInstance = this.getStore(store.name);
      if (!storeInstance) {
        return;
      }

      if (typeof store.handler === 'function') {
        handlerFns[store.name] = store.handler.bind(storeInstance);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          if (!storeInstance[store.handler]) {
            throw new Error(`${store.name} does not have a method called ${store.handler}`);
          }
        }
        handlerFns[store.name] = storeInstance[store.handler].bind(storeInstance);
      }
    };

    const handlersLength = handlers.length;

    for (let index = 0; index < handlersLength; index++) {
      storeInstanceGet(handlers[index]);
    }

    return eventExecutor(action, handlerFns);
  }

  /**
   * Returns a raw data object representation of the current state of the
   * dispatcher and all store instances. If the store implements a shouldDehdyrate
   * function, then it will be called and only dehydrate if the method returns `true`
   * @method dehydrate
   * @returns dehydrated dispatcher data
   */
  dehydrate() {
    const stores: Record<string, any> = {};

    const keys = Object.keys(this.storeInstances);

    for (let i = 0; i < keys.length; i++) {
      const storeName = keys[i];

      const store = this.storeInstances[storeName];
      const dehydrateResult = store.dehydrate();

      if (typeof dehydrateResult === 'undefined') {
        continue;
      }

      stores[storeName] = dehydrateResult;
    }

    return {
      stores,
    };
  }

  /**
   * Takes a raw data object and rehydrates the dispatcher and store instances
   * @method rehydrate
   * @param dispatcherState raw state typically retrieved from `dehydrate` method
   */
  rehydrate(dispatcherState: InitialState) {
    if (dispatcherState.stores) {
      const keys = Object.keys(dispatcherState.stores);

      for (let index = 0; index < keys.length; index++) {
        const storeName = keys[index];

        this.rehydratedStoreState[storeName] = dispatcherState.stores[storeName];
      }
    }
  }

  subscribe(callback: (state: Record<string, any>) => void): () => void;

  subscribe<S>(reducer: Reducer<S>, callback: (state: S) => void): () => void;

  subscribe(
    ...args: [(state: Record<string, any>) => void] | [Reducer<any>, (state: any) => void]
  ): () => void {
    if ('storeName' in args[0]) {
      const reducer = args[0];
      const callback = args[1];
      const reducerInstance: any = this.getStore(reducer);
      const listener = () => {
        const state = this.getState(reducer);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        callback!(state);
      };

      reducerInstance.on('change', listener);

      return () => {
        reducerInstance.off('change', listener);
      };
    }

    const callback = args[0];
    const listener = () => {
      const state = this.getState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      callback!(state);
    };

    this.on('change', listener);

    return () => {
      this.off('change', listener);
    };
  }

  getState(): Record<string, any>;
  getState<S>(reducer: Reducer<S>): S;
  getState(reducer?: Reducer<any>): any {
    if (reducer) {
      return this.fullState[reducer.storeName];
    }
    return this.fullState;
  }

  // Для отложенной инициализации контекста, в будующем нужно удалить
  setContext(context: TContext) {
    this.context = context;
  }

  hasStore(store: Reducer<any>) {
    return store.storeName in this.storeInstances && this.dispatcher.hasStore(store);
  }

  registerStore(store: Reducer<any>) {
    this.dispatcher.registerStore(store);
    this.getStore(store);
  }

  unregisterStore(store: Reducer<any>) {
    const { storeName } = store;

    this.dispatcher.unregisterStore(store);

    this.storeUnsubscribeCallbacks[storeName]();
    delete this.storeUnsubscribeCallbacks[storeName];
    delete this.rehydratedStoreState[storeName];
    delete this.storeInstances[storeName];
  }
}
