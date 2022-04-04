import { createChildApp } from '@tramvai/child-app-core';
import { createAction } from '@tramvai/core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN } from '@tramvai/tokens-child-app';
import { StateCmp } from './component';

declare global {
  interface Window {
    TRAMVAI_TEST_CHILD_APP_ACTION_CALLED_TIMES: number;
  }
}

if (typeof window !== 'undefined') {
  window.TRAMVAI_TEST_CHILD_APP_ACTION_CALLED_TIMES = 0;
}

const action = createAction({
  name: 'state-action',
  fn: () => {
    window.TRAMVAI_TEST_CHILD_APP_ACTION_CALLED_TIMES++;
  },
  conditions: {
    always: true,
    onlyBrowser: true,
  },
});

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'state',
  render: StateCmp,
  modules: [CommonChildAppModule],
  actions: [action],
  providers: [
    {
      provide: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
      multi: true,
      useValue: ['root'],
    },
  ],
});
