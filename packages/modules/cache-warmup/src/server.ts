import { Module, commandLineListTokens, provide } from '@tramvai/core';
import { PAPI_SERVICE } from '@tramvai/tokens-http-client';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/module-common';
import { warmUpCache } from './warmup';

@Module({
  imports: [],
  providers: [
    provide({
      provide: commandLineListTokens.listen,
      multi: true,
      useFactory({ papiService, logger, environmentManager }) {
        return () => {
          const log = logger('cache-warmup');

          if (!papiService) {
            log.info('Skip cache warmup when @tramvai/module-http-client is not enabled');
            return;
          }

          if (process.env.CACHE_WARMUP_DISABLED === 'true') {
            log.info('Skip cache warm up due to CACHE_WARMUP_DISABLED env');
            return;
          }

          if (process.env.NODE_ENV !== 'production') {
            log.info('Skip cache warm up in dev environment');
            return;
          }

          if (process.env.MOCKER_ENABLED === 'true') {
            log.info('Skip cache warm up when mocker is enabled');
            return;
          }

          warmUpCache({ papiService, logger, environmentManager });
        };
      },
      deps: {
        papiService: { token: PAPI_SERVICE, optional: true },
        logger: LOGGER_TOKEN,
        environmentManager: ENV_MANAGER_TOKEN,
      },
    }),
  ],
})
export class CacheWarmupModule {}
