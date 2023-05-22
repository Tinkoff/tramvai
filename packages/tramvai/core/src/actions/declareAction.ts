import type { TramvaiAction, TramvaiActionDefinition } from '@tramvai/types-actions-state-context';
import { ACTION_PARAMETERS } from '@tramvai/types-actions-state-context';
import { AbortController } from 'node-abort-controller';

export function declareAction<Params extends any[], Result, Deps = {}>(
  action: TramvaiActionDefinition<Params, Result, Deps>
): TramvaiAction<Params, Result, Deps> {
  // fallback to support compatibility with createAction
  const fn = (context: any, payload: any, deps: any) => {
    const abortController = new AbortController();

    return action.fn.apply(
      {
        executeAction: context.executeAction,
        dispatch: context.dispatch,
        getState: context.getState,
        actionType: 'standalone',
        abortController,
        abortSignal: abortController.signal,
        deps,
      },
      payload
    );
  };

  Object.defineProperty(fn, 'name', {
    value: action.name,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  // without backward compatibility we need just
  // { ...action, tramvaiActionVersion: 2 }
  return Object.assign(fn, {
    ...action,
    tramvaiActionVersion: 2,
    // fallback to support compatibility with createAction
    // @ts-ignore
    [ACTION_PARAMETERS]: {
      ...action,
      conditions: action.conditions ?? {},
    },
  });
}

export function isTramvaiAction<Params extends any[], Result, Deps>(
  action: any
): action is TramvaiAction<Params, Result, Deps> {
  return 'tramvaiActionVersion' in action && action.tramvaiActionVersion === 2;
}
