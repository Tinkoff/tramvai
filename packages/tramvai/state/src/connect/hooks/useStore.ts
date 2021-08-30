import noop from '@tinkoff/utils/function/noop';
import { useMemo, useReducer, useRef } from 'react';
import type { Reducer } from '../../createReducer/createReducer.h';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useConsumerContext } from './useConsumerContext';

export function useStore<S>(reducer: Reducer<S>): S {
  const context = useConsumerContext();
  const stateRef = useRef<S>();
  const reducerRef = useRef(reducer);
  const addedReducerRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<Function>(noop);
  const [, forceRender] = useReducer((s) => s + 1, 0);

  useMemo(() => {
    // отписываемся от обновлений текущего редьюсера
    unsubscribeRef.current();

    // если мы получили новый редьюсер
    if (reducer.storeName !== reducerRef.current.storeName) {
      // если текущий редьюсер был зарегистрирован в диспетчере в этом хуке,
      // удаляем его из диспетчера
      if (addedReducerRef.current === reducerRef.current.storeName) {
        context.unregisterStore(reducerRef.current);
        addedReducerRef.current = null;
      }
      // заменяем текущий редьюсер
      reducerRef.current = reducer;
    }

    // если текущий редьюсер не зарегистрирован в диспетчере,
    // регистрируем его вручную
    if (!context.hasStore(reducerRef.current)) {
      context.registerStore(reducerRef.current);
      addedReducerRef.current = reducerRef.current.storeName;
    }

    // подписываемся на обновления текущего редьюсера,
    // если состояние текущего редьюсера изменилось,
    // ререндерим компонент
    unsubscribeRef.current = context.subscribe(reducerRef.current, (nextState) => {
      stateRef.current = nextState;
      forceRender();
    });

    // сохраняем состояние текущего редьюсера
    stateRef.current = context.getState(reducerRef.current);
  }, [reducer, context]);

  // гарантируем отписку от обновлений текущего редьюсера,
  // при анмаунте компонента
  useIsomorphicLayoutEffect(() => {
    return () => {
      unsubscribeRef.current();
    };
  }, []);

  return stateRef.current as S;
}
