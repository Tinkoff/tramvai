import each from '@tinkoff/utils/array/each';
import split from '@tinkoff/utils/string/split';
import { Module, Scope } from '@tramvai/core';
import { LOGGER_TOKEN, LOGGER_INIT_HOOK } from '@tramvai/tokens-common';
import { ENV_USED_TOKEN } from '@tramvai/module-environment';
import { logger } from '@tinkoff/logger';
import { serverProviders } from './devLogs';

export * from './LogStore';

export { LOGGER_TOKEN };

export function factory({ environmentManager, loggerInitHooks }) {
  const level = environmentManager.get('LOG_LEVEL') ?? environmentManager.get('DEBUG_LEVEL');
  const enable = environmentManager.get('LOG_ENABLE') ?? environmentManager.get('DEBUG_ENABLE');

  logger.clear();
  logger.setLevel(level as any);

  if (enable) {
    each((val) => {
      const [lvl, ...name] = val.split(':');

      logger.enable(lvl, name.join(':'));
    }, split(',', enable));
  }

  if (loggerInitHooks) {
    for (const hookFn of loggerInitHooks) {
      hookFn(logger);
    }
  }

  return logger;
}

@Module({
  providers: [
    ...(process.env.NODE_ENV === 'development' ? serverProviders : []),
    {
      provide: LOGGER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: factory,
      deps: {
        environmentManager: 'environmentManager',
        loggerInitHooks: { token: LOGGER_INIT_HOOK, optional: true, multi: true },
      },
    },
    {
      provide: ENV_USED_TOKEN,
      useValue: [
        { key: 'LOG_LEVEL', optional: true, dehydrate: false },
        { key: 'LOG_ENABLE', optional: true, dehydrate: false },
        { key: 'APP_VERSION', optional: true, dehydrate: true },
        { key: 'APP_RELEASE', optional: true, dehydrate: true },
        /**
         * @deprecated используйте LOG_LEVEL
         */
        { key: 'DEBUG_LEVEL', optional: true, dehydrate: false, value: 'warn' },
        /**
         * @deprecated используйте LOG_ENABLE
         */
        { key: 'DEBUG_ENABLE', optional: true, dehydrate: false },
      ],
      multi: true,
    },
  ],
})
export class LogModule {}
