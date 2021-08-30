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
      // в приложении можно указать лимит на выполнение экшенов на сервере (по умолчанию 500мс)
      provide: 'limitActionGlobalTimeRun',
      useValue: ACTION_EXECUTION_LIMIT,
    }),
  ],
  // эта экшены будут выполняться для всех страниц приложения
  actions: [globalInLimit, globalOutLimit],
  bundles: {
    mainDefault: () => Promise.resolve({ default: mainDefault }),
  },
});
