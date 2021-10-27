import type { Reducer } from '@tramvai/state';
import { createDispatcher } from '@tramvai/state';

/**
 * Helper for testing Reducer
 * @param reducer
 */
export const testReducer = <T = any>(reducer: Reducer<T>) => {
  const dispatcherContext = createDispatcher({ stores: [reducer] }).createContext(null, {});

  return {
    dispatch: dispatcherContext.dispatch.bind(dispatcherContext),
    getState: () => dispatcherContext.getState(reducer),
  };
};
