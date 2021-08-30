import type { ActionCondition } from '@tramvai/tokens-common';

export const alwaysCondition: ActionCondition = {
  key: 'alwaysCondition',
  fn: (checker) => {
    if (checker.conditions.always) {
      checker.allow();
    }
  },
};
