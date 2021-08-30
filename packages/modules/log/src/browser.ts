import { logger } from '@tinkoff/logger';
import { Module } from '@tramvai/core';
import { LOGGER_TOKEN, LOGGER_INIT_HOOK } from '@tramvai/tokens-common';

import { clientProviders } from './devLogs';

export * from './LogStore';

export { LOGGER_TOKEN };

@Module({
  providers: [
    ...(process.env.NODE_ENV === 'development' ? clientProviders : []),
    {
      provide: LOGGER_TOKEN,
      useFactory({ loggerInitHooks }) {
        if (loggerInitHooks) {
          for (const hookFn of loggerInitHooks) {
            hookFn(logger);
          }
        }

        return logger;
      },
      deps: {
        loggerInitHooks: { token: LOGGER_INIT_HOOK, multi: true, optional: true },
      },
    },
  ],
})
export class LogModule {}
