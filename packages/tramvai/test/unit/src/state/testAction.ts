import type { Action } from '@tramvai/core';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { createMockContext } from '@tramvai/test-mocks';

type OptionsContext = Parameters<typeof createMockContext>[0];

type Options = OptionsContext & {
  context?: typeof CONTEXT_TOKEN;
};

/**
 * Helper for testing actions
 * @param action action itself
 * @param params options for creation ConsumerContext or instance of context
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
    /**
     * @description
     * Run action
     * @param payload
     * @returns
     */
    run: (payload?: P) => {
      return context.executeAction(action, payload);
    },
  };
};
