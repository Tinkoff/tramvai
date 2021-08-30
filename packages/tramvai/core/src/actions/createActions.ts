import type { ActionParameters, Action } from '../types/action';
import { ACTION_PARAMETERS } from '../types/action';

export function createAction<Result = any, Payload = any, Deps = any>(
  action: ActionParameters<Payload, Result, Deps>
): Action<Payload, Result, Deps> {
  const result: Action<Payload, Result, Deps> = Object.assign(action.fn, {
    [ACTION_PARAMETERS]: action,
  });

  if (!action.conditions) {
    // eslint-disable-next-line no-param-reassign
    action.conditions = {};
  }

  return result;
}
