import type { TramvaiAction, TramvaiActionDefinition } from '@tramvai/types-actions-state-context';

export function declareAction<Params extends any[], Result, Deps = {}>(
  action: TramvaiActionDefinition<Params, Result, Deps>
): TramvaiAction<Params, Result, Deps> {
  return {
    ...action,
    tramvaiActionVersion: 2,
  };
}

export function isTramvaiAction<Params extends any[], Result, Deps>(
  action: any
): action is TramvaiAction<Params, Result, Deps> {
  return 'tramvaiActionVersion' in action && action.tramvaiActionVersion === 2;
}
