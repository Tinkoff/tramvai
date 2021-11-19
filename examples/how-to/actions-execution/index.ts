import { createApp, provide } from '@tramvai/core';
import { ACTION_EXECUTION_LIMIT } from './constants';
import { modules } from '../common';
import { globalInLimit, globalOutLimit } from './actions/global';
import { mainDefault } from './bundles/mainDefault';

createApp({
  name: 'actions-execution',
  modules: [...modules],
  providers: [
    provide({
      // in the application you can specify a limit on the execution of actions on the server (by default 500ms)
      provide: 'limitActionGlobalTimeRun',
      useValue: ACTION_EXECUTION_LIMIT,
    }),
  ],
  // these actions will be executed for all pages of the application
  actions: [globalInLimit, globalOutLimit],
  bundles: {
    mainDefault: () => Promise.resolve({ default: mainDefault }),
  },
});
