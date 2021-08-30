import type { Middleware } from './dispatcher.h';
import { DispatcherContext } from './dispatcherContext';
import type { StoreClass } from '../typings';
import type { Reducer } from '../createReducer/createReducer.h';

export class Dispatcher {
  stores: Record<StoreClass['storeName'], StoreClass>;

  /**
   * @class Dispatcher
   * @param options Dispatcher options
   * @param options.stores Array of stores to register
   * @constructor
   */
  constructor(options?: { stores?: StoreClass[] }) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    // eslint-disable-next-line no-param-reassign
    options.stores = options.stores || ([] as any[]);
    this.stores = {};
    this.handlers = {};

    options.stores.forEach((store) => {
      this.registerStore(store);
    });
  }

  handlers: Record<
    string,
    Array<{
      name: string;
      handler: Function | string;
    }>
  >;

  createContext<T>(context: T, initialState: any, middlewares?: Middleware[]) {
    return new DispatcherContext<T>(this, context, initialState, middlewares);
  }

  hasStore(store: Reducer<any>) {
    return !!this.stores[store.storeName];
  }

  /**
   * Registers a store so that it can handle actions.ß
   * @param store A store class to be registered. The store should have a static
   *      `storeName` property so that it can be loaded later.
   * @throws {Error} if store is invalid
   * @throws {Error} if store is already registered
   */
  registerStore(store: StoreClass) {
    const { storeName } = store;

    if (this.stores[storeName]) {
      if (this.stores[storeName] === store) {
        // Store is already registered, nothing to do
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        throw new Error(
          `Store with name '${storeName}' has already been registered.
                Make sure you do not have multiple copies of the store installed.
                exist ${this.stores[storeName]}
                try ${store}`
        );
      }
    }

    this.stores[storeName] = store;

    if (store.handlers) {
      Object.keys(store.handlers).forEach((action) => {
        const handler = store.handlers[action];

        this.registerHandler(action, storeName, handler);
      });
    }
  }

  unregisterStore(store: Reducer<any>) {
    const { storeName } = store;

    if (!this.stores[storeName]) {
      return;
    }

    delete this.stores[storeName];

    if (store.handlers) {
      Object.keys(store.handlers).forEach((action) => {
        const handler = store.handlers[action];

        this.unregisterHandler(action, storeName, handler);
      });
    }
  }

  /**
   * Gets a name from a store
   * @param {String|Object} store The store name or class from which to extract
   */
  // eslint-disable-next-line class-methods-use-this
  getStoreName(store: StoreClass | string) {
    if (typeof store === 'string') {
      return store;
    }

    return store.storeName;
  }

  /**
   * Adds a handler function to be called for the given action
   * @param action Name of the action
   * @param name Name of the store that handles the action
   * @param handler The function or name of the method that handles the action
   */
  private registerHandler(action: string, name: string, handler: Function | string) {
    this.handlers[action] = this.handlers[action] || [];
    this.handlers[action].push({
      name,
      handler,
    });
  }

  private unregisterHandler(action: string, name: string, handler: Function | string) {
    if (Array.isArray(this.handlers[action])) {
      this.handlers[action] = this.handlers[action].filter((actionHandlers) => {
        return !(actionHandlers.name === name && actionHandlers.handler === handler);
      });
    }
  }
}

export function createDispatcher(options?: { stores?: StoreClass[] }) {
  return new Dispatcher(options);
}
