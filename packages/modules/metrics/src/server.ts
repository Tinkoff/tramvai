import { Scope, Module, provide, commandLineListTokens } from '@tramvai/core';
import { SPECIAL_SERVER_PATHS } from '@tramvai/tokens-server';
import {
  WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
} from '@tramvai/tokens-server-private';
import { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import { measure } from '@tinkoff/measure-express-requests';
import { Registry, Counter, Gauge, Histogram, Summary, collectDefaultMetrics } from 'prom-client';
import flatten from '@tinkoff/utils/array/flatten';
import { RequestModule } from './request';
import { InstantMetricsModule } from './instantMetrics/server';
import { eventLoopMetrics } from './metrics/eventLoop';
import { METRICS_MODULE_CONFIG_TOKEN } from './tokens';

@Module({
  imports: [RequestModule, InstantMetricsModule],
  providers: [
    provide({
      provide: METRICS_MODULE_CONFIG_TOKEN,
      useValue: {
        enableConnectionResolveMetrics: false,
      },
    }),
    provide({
      provide: 'metricsDefaultRegistry',
      useClass: Registry,
    }),
    provide({
      provide: METRICS_MODULE_TOKEN,
      useFactory: ({ registry }): typeof METRICS_MODULE_TOKEN => {
        collectDefaultMetrics({ register: registry });

        return {
          counter: (opt) => new Counter({ registers: [registry], ...opt }),
          gauge: (opt) => new Gauge({ registers: [registry], ...opt }),
          histogram: (opt) => new Histogram({ registers: [registry], ...opt }),
          summary: (opt) => new Summary({ registers: [registry], ...opt }),
        };
      },
      scope: Scope.SINGLETON,
      deps: {
        registry: 'metricsDefaultRegistry',
      },
    }),
    provide({
      provide: WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
      useFactory: ({
        app,
        metrics,
        additionalLabelNamesList,
        getAdditionalLabelValuesList,
        httpRequestsDurationBuckets,
        metricsExcludePaths,
        registry,
      }) => {
        return async () => {
          app.all('/metrics', async (_, res) => {
            res.type(registry.contentType);

            return registry.metrics();
          });

          const measured = measure({
            metrics,
            metricsExcludePaths,
            additionalLabelNames: flatten(additionalLabelNamesList || []) as string[],
            getAdditionalLabelValues(req, res) {
              if (!getAdditionalLabelValuesList) {
                return {};
              }

              return getAdditionalLabelValuesList.reduce(
                (labelValues, getLV) => ({
                  ...labelValues,
                  ...getLV(req, res),
                }),
                {}
              );
            },
            httpRequestsDurationBuckets,
          });

          app.addHook('onRequest', (request, reply, next) => {
            measured({ ...request.raw, path: request.url } as any, reply as any, next);
          });
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
        app: WEB_FASTIFY_APP_TOKEN,
        additionalLabelNamesList: {
          token: 'additionalLabelNames',
          multi: true,
          optional: true,
        },
        getAdditionalLabelValuesList: {
          token: 'getAdditionalLabelValues',
          multi: true,
          optional: true,
        },
        httpRequestsDurationBuckets: {
          token: 'httpRequestsDurationBuckets',
          optional: true,
        },
        metricsExcludePaths: SPECIAL_SERVER_PATHS,
        registry: 'metricsDefaultRegistry',
      },
      multi: true,
    }),
    provide({
      provide: commandLineListTokens.listen,
      useFactory: ({ metrics }) => {
        return () => {
          eventLoopMetrics(metrics);
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
      },
      multi: true,
    }),
  ],
})
export class MetricsModule {}

export { METRICS_MODULE_CONFIG_TOKEN };
