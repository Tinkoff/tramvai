import type { ActionCondition } from '@tramvai/tokens-common';
import { isServer } from './helpers';
import { actionType } from '../constants';

export const pageBrowser: ActionCondition = {
  key: 'pageBrowser',
  fn: (checker) => {
    if (checker.conditions.pageBrowser && checker.type === actionType.global && isServer) {
      checker.forbid();
    }
  },
};
