import type { ActionCondition } from '@tramvai/tokens-common';
import { isBrowser } from './helpers';

export const onlyServer: ActionCondition = {
  key: 'onlyServer',
  fn: (checker) => {
    if (checker.conditions.onlyServer && isBrowser) {
      checker.forbid();
    }
  },
};
