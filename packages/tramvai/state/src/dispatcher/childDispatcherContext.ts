import type { DispatcherContext as DispatcherContextInterface } from '@tramvai/types-actions-state-context';
import type { Dispatcher } from './dispatcher';
import type { StoreClass } from '../typings';
import type { Middleware } from './dispatcher.h';

import { DispatcherContext } from './dispatcherContext';

type InitialState = { stores: Record<string, any> };

export class ChildDispatcherContext<TContext> extends DispatcherContext<TContext> {
  private parentDispatcherContext: DispatcherContextInterface<TContext>;
  private allowedParentStores = new Set<string>();

  /**
   * @param context The context to be used for store instances
   */
  constructor({
    dispatcher,
    context,
    initialState,
    parentDispatcherContext,
    middlewares,
    parentAllowedStores,
  }: {
    dispatcher: Dispatcher;
    context: TContext;
    initialState: InitialState;
    middlewares?: Middleware[];
    parentDispatcherContext: DispatcherContextInterface<TContext>;
    parentAllowedStores?: Array<
      StoreClass | string | { store: StoreClass | string; optional: true }
    >;
  }) {
    super(dispatcher, context, initialState, middlewares);

    this.parentDispatcherContext = parentDispatcherContext;

    parentAllowedStores?.forEach((store) => {
      const storeName = this.dispatcher.getStoreName(
        typeof store === 'object' ? store.store : store
      );
      this.allowedParentStores.add(storeName);
      // use just storeName to prevent store initialization on the root-app side
      this.getStore({ store: storeName, optional: true });
    });
  }

  getStore<T extends StoreClass>(
    storeClass: T | string | { store: T | string; optional: true }
  ): InstanceType<T> | null {
    let storeClassPrepared;

    if (typeof storeClass === 'object') {
      storeClassPrepared = storeClass.store;
    } else {
      storeClassPrepared = storeClass;
    }

    const storeName = this.dispatcher.getStoreName(storeClassPrepared);

    if (this.dispatcher.stores[storeName]) {
      return super.getStore(storeClass);
    }

    if (this.allowedParentStores.has(storeName)) {
      // use just storeName to prevent store initialization on the root-app side
      const storeInstance = this.parentDispatcherContext.getStore({
        store: storeName,
        optional: true,
      });

      if (!storeInstance) {
        return null;
      }

      this.storeSubscribe(storeName, storeInstance);

      return storeInstance;
    }

    return super.getStore(storeClass);
  }
}
