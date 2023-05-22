import { createChildApp } from '@tramvai/child-app-core';
import { createAction, provide } from '@tramvai/core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { BaseCmp } from './component';
import { CHILD_APP_BASE_TOKEN } from './tokens';

declare global {
  interface Window {
    TRAMVAI_TEST_CHILD_APP_NOT_PRELOADED_ACTION_CALL_NUMBER: number;
  }
}

if (typeof window !== 'undefined') {
  window.TRAMVAI_TEST_CHILD_APP_NOT_PRELOADED_ACTION_CALL_NUMBER = 0;
}

const action = createAction({
  name: 'action',
  fn() {
    window.TRAMVAI_TEST_CHILD_APP_NOT_PRELOADED_ACTION_CALL_NUMBER++;
  },
  conditions: {
    always: true,
    onlyBrowser: true,
  },
});

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'base',
  render: BaseCmp,
  modules: [CommonChildAppModule],
  actions: [action],
  providers: [
    provide({
      provide: CHILD_APP_BASE_TOKEN,
      useValue: "I'm little child app",
    }),
  ],
});
