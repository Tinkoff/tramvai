import { Module, Scope, commandLineListTokens } from '@tramvai/core';
import { LOGGER_TOKEN, CONTEXT_TOKEN } from '@tramvai/module-common';
import { PAPI_SERVICE } from '@tramvai/tokens-http-client';
import { RemoteReporter } from '@tinkoff/logger';
import { sharedProviders } from './shared';

@Module({
  providers: [
    ...sharedProviders,
    {
      // При такой схеме подключения отправка instant метрик заработает только после этого
      // провайдера, но подлючить через LOGGER_INIT_HOOK не представляется возможным потому что
      // возникает циклическая зависимость контекст -> логгер -> хук метрик -> контекст
      provide: commandLineListTokens.init,
      scope: Scope.SINGLETON,
      multi: true,
      useFactory({
        logger,
        papiService,
        context,
      }: {
        logger: typeof LOGGER_TOKEN;
        papiService?: typeof PAPI_SERVICE;
        context: typeof CONTEXT_TOKEN;
      }) {
        if (!papiService) {
          logger.error({
            event: 'instantMetrics-error',
            message: 'papiService не подключен',
          });

          return () => {};
        }

        const validMetricsMap = context.getStore('instantMetrics').getState().instantMetricsMap;

        const instantMetricsReporter = new RemoteReporter({
          requestCount: 1,
          emitLevels: {
            trace: true,
            debug: true,
            info: true,
            warn: true,
            error: true,
            fatal: true,
          },
          makeRequest(logObject) {
            if (validMetricsMap[logObject.event]) {
              return papiService
                .request({
                  path: `metrics/${logObject.event}`,
                  method: 'post',
                  payload: logObject.value
                    ? {
                        value: logObject.value,
                      }
                    : {},
                })
                .then(({ payload }) => payload);
            }

            return Promise.resolve();
          },
        });

        return () => {
          logger.addBeforeReporter(instantMetricsReporter);
        };
      },
      deps: {
        papiService: {
          token: PAPI_SERVICE,
          optional: true,
        },
        context: CONTEXT_TOKEN,
        logger: LOGGER_TOKEN,
      },
    },
  ],
})
export class InstantMetricsModule {}
