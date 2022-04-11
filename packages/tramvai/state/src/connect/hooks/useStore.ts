import { useCallback, useRef, useContext } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { Reducer } from '../../createReducer/createReducer.h';
import { ServerStateContext } from '../context';
import { useConsumerContext } from './useConsumerContext';

export function useStore<S>(reducer: Reducer<S>): S {
  const context = useConsumerContext();
  const serverState = useContext(ServerStateContext);
  const reducerRef = useRef(reducer);
  const addedReducerRef = useRef<string | null>(null);

  // если текущий редьюсер не зарегистрирован в диспетчере,
  // регистрируем его вручную, что бы гарантировать работоспособность `context.getState(reducer)`,
  // и сохраняем в `addedReducerRef`, что бы удалить при unmount
  if (!context.hasStore(reducer)) {
    context.registerStore(reducer);
    addedReducerRef.current = reducer.storeName;
  }

  const subscribe = useCallback(
    (reactUpdate: () => void) => {
      const unsubscribe = context.subscribe(reducer, reactUpdate);

      // заменяем текущий редьюсер
      reducerRef.current = reducer;

      return () => {
        // гарантируем отписку от обновлений текущего редьюсера,
        // при анмаунте компонента
        unsubscribe();

        // если текущий редьюсер был зарегистрирован в диспетчере в этом хуке,
        // удаляем его из диспетчера
        if (addedReducerRef.current) {
          context.unregisterStore(reducerRef.current);
          addedReducerRef.current = null;
        }
      };
    },
    [reducer, context]
  );

  return useSyncExternalStore(
    subscribe,
    () => context.getState(reducer),
    serverState ? () => serverState[reducer.storeName] : () => context.getState(reducer)
  );
}
