import type { Provider } from '@tramvai/core';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { onChangeHooksToken } from '../../tokens';
import { fillRouterStore } from './fillRouterStore';

export const commonHooks: Provider[] = [
  {
    provide: onChangeHooksToken,
    multi: true,
    useFactory: fillRouterStore,
    deps: {
      context: CONTEXT_TOKEN,
    },
  },
];
