import noop from '@tinkoff/utils/function/noop';
import { useReducer, useRef } from 'react';
import type { Reducer } from '../../createReducer/createReducer.h';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useConsumerContext } from './useConsumerContext';

export function useStore<S>(reducer: Reducer<S>): S {
  const context = useConsumerContext();
  const reducerRef = useRef(reducer);
  const addedReducerRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<Function>(noop);
  const [, forceRender] = useReducer((s) => s + 1, 0);

  // если текущий редьюсер не зарегистрирован в диспетчере,
  // регистрируем его вручную, что бы гарантировать работоспособность `context.getState(reducer)`,
  // и сохраняем в `addedReducerRef`, что бы удалить при unmount
  if (!context.hasStore(reducer)) {
    context.registerStore(reducer);
    addedReducerRef.current = reducer.storeName;
  }

  const stateRef = useRef<S>(context.getState(reducer));

  useIsomorphicLayoutEffect(() => {
    const subscribe = (updatedState: S) => {
      // если состояние текущего редьюсера изменилось,
      // обновляем локальное состояние и ререндерим компонент
      if (stateRef.current !== updatedState) {
        stateRef.current = updatedState;
        forceRender();
      }
    };

    // сразу обновляем состояние
    subscribe(context.getState(reducer));
    // и подписываемся на обновления редьюсера
    unsubscribeRef.current = context.subscribe(reducer, subscribe);

    // заменяем текущий редьюсер
    reducerRef.current = reducer;

    return () => {
      // гарантируем отписку от обновлений текущего редьюсера,
      // при анмаунте компонента
      unsubscribeRef.current();

      // если текущий редьюсер был зарегистрирован в диспетчере в этом хуке,
      // удаляем его из диспетчера
      if (addedReducerRef.current) {
        context.unregisterStore(reducerRef.current);
        addedReducerRef.current = null;
      }
    };
  }, [reducer, context]);

  return stateRef.current as S;
}
