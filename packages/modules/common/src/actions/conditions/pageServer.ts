import type { ActionCondition } from '@tramvai/tokens-common';
import { isBrowser } from './helpers';
import { actionType } from '../constants';

export const pageServer: ActionCondition = {
  key: 'pageServer',
  fn: (checker) => {
    if (checker.conditions.pageServer && checker.type === actionType.global && isBrowser) {
      checker.forbid();
    }
  },
};
