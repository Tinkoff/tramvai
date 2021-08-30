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
      useFactory(deps) {
        return () => {
          const log = deps.logger('cache-warmup');

          if (!deps.papiService) {
            log.info('Skip cache warmup when @travmai/module-api-clients is not enabled');
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

          warmUpCache(deps);
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
