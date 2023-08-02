import type { Action, TramvaiAction } from '@tramvai/core';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { createMockContext } from '@tramvai/test-mocks';

type OptionsContext = Parameters<typeof createMockContext>[0];

type Options = OptionsContext & {
  context?: typeof CONTEXT_TOKEN;
};

interface Runner<Params extends any[], Result> {
  run: (...params: Params) => Result;
  context: typeof CONTEXT_TOKEN;
}

/**
 * Helper for testing actions
 * @param action action itself
 * @param params options for creation ConsumerContext or instance of context
 */
export function testAction<Params extends any[], Result, Deps>(
  action: TramvaiAction<Params, Result, Deps>,
  options?: Options
): Runner<Params, Result>;
export function testAction<Payload, Result, Deps>(
  action: Action<Payload, Result, Deps>,
  options?: Options
): Runner<[Payload], Result>;
export function testAction(
  action: Action | TramvaiAction<any[], any, any>,
  {
    initialState,
    providers,
    modules,
    di,
    store,
    stores,
    context = createMockContext({ initialState, di, providers, modules, store, stores }),
  }: Options = {}
) {
  return {
    /**
     * @description
     * Run action
     * @param payload
     * @returns
     */
    run: (payload?: any) => {
      return context.executeAction(action as any, payload);
    },
    context,
  };
}
