import keys from '@tinkoff/utils/object/keys';
import difference from '@tinkoff/utils/array/difference';

import type { StoreClass } from '@tramvai/state';
import { createReducer } from '@tramvai/state';
import { createDispatcher } from '@tramvai/state';
import type { STORE_TOKEN } from '@tramvai/tokens-common';

interface Options {
  stores?: StoreClass[];
  initialState?: Record<string, any>;
}

/**
 * Creates mock for a global app store
 *
 * @param stores - stores list
 * @param initialState - initialState for store (!warning: in order to work, keys in initial state should match to names of the stores)
 */
export const createMockStore = ({
  stores = [],
  initialState = {},
}: Options = {}): typeof STORE_TOKEN => {
  const mockStores: StoreClass[] = [];

  const diffKeys = difference(
    keys(initialState),
    stores.map((store) => store.storeName)
  );

  for (const key of diffKeys) {
    mockStores.push(createReducer(key, initialState[key]));
  }

  const dispatcherContext = createDispatcher({
    stores: [...stores, ...mockStores],
  }).createContext(null, {
    stores: initialState,
  });

  return {
    getState: dispatcherContext.getState.bind(dispatcherContext),
    dispatch: dispatcherContext.dispatch.bind(dispatcherContext),
    subscribe: dispatcherContext.subscribe.bind(dispatcherContext),
    // @deprecated do not use this property
    // @ts-ignore
    __dispatcherContext__: dispatcherContext,
  };
};
