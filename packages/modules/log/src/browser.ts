import { BrowserReporter, createLoggerFactory } from '@tinkoff/logger';
import { Module } from '@tramvai/core';
import { LOGGER_TOKEN, LOGGER_INIT_HOOK } from '@tramvai/tokens-common';
import { LOGGER_NAME, LOGGER_KEY } from './constants';

import { clientProviders } from './devLogs';

export * from './LogStore';

export { LOGGER_TOKEN };

const logger = createLoggerFactory({
  name: LOGGER_NAME,
  key: LOGGER_KEY,
  reporters: [new BrowserReporter()],
});

export { logger };

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
