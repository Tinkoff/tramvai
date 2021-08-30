import type { ActionCondition } from '@tramvai/tokens-common';
import { isServer } from './helpers';

export const onlyBrowser: ActionCondition = {
  key: 'onlyBrowser',
  fn: (checker) => {
    if (checker.conditions.onlyBrowser && isServer) {
      checker.forbid();
    }
  },
};
