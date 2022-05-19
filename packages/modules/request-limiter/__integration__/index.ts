import { createApp, provide } from '@tramvai/core';
import {
  RequestLimiterModule,
  REQUESTS_LIMITER_ACTIVATE_TOKEN,
} from '@tramvai/module-request-limiter';
import { commandLineListTokens } from '@tramvai/core';
import { modules, bundles } from '../../../../test/shared/common';

createApp({
  name: 'requestsLimiter',
  modules: [...modules, RequestLimiterModule],
  providers: [
    provide({
      provide: REQUESTS_LIMITER_ACTIVATE_TOKEN,
      useValue: true,
    }),

    provide({
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useValue: () => {
        if (typeof window === 'undefined') {
          const crypto = require('crypto');

          // heavy cpu-task
          const key = crypto.pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');

          return key;
        }
      },
    }),
  ],
  bundles,
});
