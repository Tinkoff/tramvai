import { createApp } from './createApp';
import { UI_SHOW_BANNER_TOKEN, UI_OS_NOTIFY_TOKEN, UI_SHOW_PROGRESS_TOKEN } from '../di/tokens';

export const app = createApp({
  commands: {
    start: () => import('../api/start'),
    build: () => import('../api/build'),
    benchmark: () => import('../api/benchmark'),
    analyze: () => import('../api/analyze'),
  },
  providers: [
    {
      provide: UI_SHOW_PROGRESS_TOKEN,
      useValue: true,
    },
    {
      provide: UI_SHOW_BANNER_TOKEN,
      useValue: true,
    },
    {
      provide: UI_OS_NOTIFY_TOKEN,
      useValue: true,
    },
  ],
});
