import { useCallback } from 'react';
import { useSelector } from './useSelector';
import type { Reducer } from '../..';

export const useStoreSelector = <TState, TPayload>(
  store: Reducer<TState>,
  selector: (state: TState) => TPayload
) => {
  const memoizedSelector = useCallback(
    (stores: Record<string, any>) => {
      return selector(stores[store.storeName]);
    },
    [store, selector]
  );

  return useSelector(store, memoizedSelector);
};
