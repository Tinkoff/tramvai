import type { Action } from '@tramvai/core';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { createMockContext } from '@tramvai/test-mocks';

type OptionsContext = Parameters<typeof createMockContext>[0];

type Options = OptionsContext & {
  context?: typeof CONTEXT_TOKEN;
};

/**
 * Позволяет протестировать экшен
 * @param action экшен для тестирования
 * @param params параметры для создания ConsumerContext или сам инстанс context
 */
export const testAction = <P>(
  action: Action<P>,
  {
    initialState,
    providers,
    di,
    store,
    stores,
    context = createMockContext({ initialState, di, providers, store, stores }),
  }: Options = {}
) => {
  return {
    run: (payload: P) => {
      return context.executeAction(action, payload);
    },
  };
};
