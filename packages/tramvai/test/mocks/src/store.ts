import type { StoreClass } from '@tramvai/state';
import { createDispatcher } from '@tramvai/state';
import type { STORE_TOKEN } from '@tramvai/tokens-common';

interface Options {
  stores?: StoreClass[];
  initialState?: Record<string, any>;
}

/**
 * Создаёт мок для глобального стора в приложении
 *
 * @param stores - список сторов
 * @param initialState - начальное состояние сторов (!важно: чтобы начальное состояние работало ключи в нём должны совпадать с именами сторов)
 */
export const createMockStore = ({
  stores = [],
  initialState = {},
}: Options = {}): typeof STORE_TOKEN => {
  const dispatcherContext = createDispatcher({ stores }).createContext(null, {
    stores: initialState,
  });

  return {
    getState: dispatcherContext.getState.bind(dispatcherContext),
    dispatch: dispatcherContext.dispatch.bind(dispatcherContext),
    subscribe: dispatcherContext.subscribe.bind(dispatcherContext),
    // @deprecated не используйте это свойство в своём коде
    // @ts-ignore
    __dispatcherContext__: dispatcherContext,
  };
};
