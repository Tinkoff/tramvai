import { Module, commandLineListTokens } from '@tramvai/core';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { createPapiMethod } from '@tramvai/papi';
import type { Counter } from '@tramvai/tokens-metrics';
import { METRICS_MODULE_TOKEN, REGISTER_INSTANT_METRIC_TOKEN } from '@tramvai/tokens-metrics';
import { LOGGER_TOKEN, CONTEXT_TOKEN } from '@tramvai/module-common';
import fromPairs from '@tinkoff/utils/object/fromPairs';
import { sharedProviders } from './shared';
import { setInstantMetrics } from './store';

@Module({
  providers: [
    ...sharedProviders,
    {
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory({
        metrics,
        logger,
        instantMetrics,
      }: {
        metrics: typeof METRICS_MODULE_TOKEN;
        logger: typeof LOGGER_TOKEN;
        instantMetrics: typeof REGISTER_INSTANT_METRIC_TOKEN[];
      }) {
        const log = logger('instantmetrics:papi');
        const instantMetricsMap: Record<string, Counter<string>> = fromPairs(instantMetrics || []);

        return createPapiMethod({
          method: 'post',
          path: '/metrics/:metric',
          options: {
            schema: {
              body: {
                type: 'object',
                properties: {
                  value: {
                    type: 'number',
                    minimum: 0,
                  },
                },
                additionalProperties: false,
              },
            },
          },
          async handler({ params: { metric }, body, responseManager }) {
            if (!instantMetricsMap[metric]) {
              log.error({
                event: 'client-instant-metric-mismatch',
                metricName: metric,
                error: new Error(`No instant metric instance found with name: ${metric}`),
              });

              responseManager.setStatus(404);
              responseManager.setBody({
                resultCode: 'NOT_FOUND',
                errorMessage: 'metric not found',
              });

              return;
            }

            instantMetricsMap[metric].inc(body?.value);

            return { status: 'ok' };
          },
        });
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
        logger: LOGGER_TOKEN,
        instantMetrics: {
          token: REGISTER_INSTANT_METRIC_TOKEN,
          multi: true,
          optional: true,
        },
      },
    },
    {
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory({
        instantMetrics,
        context,
      }: {
        instantMetrics: typeof REGISTER_INSTANT_METRIC_TOKEN[];
        context: typeof CONTEXT_TOKEN;
      }) {
        return async () => {
          if (!instantMetrics) {
            return;
          }

          const instantMetricsMap = instantMetrics.reduce((acc, [metricName]) => {
            acc[metricName] = true;

            return acc;
          }, {});

          await context.dispatch(setInstantMetrics({ instantMetricsMap }));
        };
      },
      deps: {
        context: CONTEXT_TOKEN,
        instantMetrics: {
          token: REGISTER_INSTANT_METRIC_TOKEN,
          multi: true,
          optional: true,
        },
      },
    },
  ],
})
export class InstantMetricsModule {}
