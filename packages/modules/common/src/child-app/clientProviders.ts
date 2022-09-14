import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { INITIAL_APP_STATE_TOKEN } from '@tramvai/tokens-common';
import {
  CHILD_APP_COMMON_INITIAL_STATE_TOKEN,
  CHILD_APP_INTERNAL_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';

export const providers: Provider[] = [
  provide({
    provide: INITIAL_APP_STATE_TOKEN,
    useFactory: ({ commonState, config }) => {
      return commonState[`${config.key}`];
    },
    deps: {
      commonState: CHILD_APP_COMMON_INITIAL_STATE_TOKEN,
      config: CHILD_APP_INTERNAL_CONFIG_TOKEN,
    },
  }),
];
