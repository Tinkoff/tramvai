import { Scope, Module, provide, commandLineListTokens } from '@tramvai/core';
import { UTILITY_SERVER_PATHS } from '@tramvai/tokens-server';
import {
  UTILITY_WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
  WEB_FASTIFY_APP_INIT_TOKEN,
} from '@tramvai/tokens-server-private';
import { METRICS_MODULE_TOKEN, METRICS_MODULE_CONFIG_TOKEN } from '@tramvai/tokens-metrics';
import { fastifyMeasureRequests } from '@tinkoff/measure-fastify-requests';
import { Registry, Counter, Gauge, Histogram, Summary, collectDefaultMetrics } from 'prom-client';
import flatten from '@tinkoff/utils/array/flatten';
import { RequestModule } from './request';
import { InstantMetricsModule } from './instantMetrics/server';
import { eventLoopMetrics } from './metrics/eventLoop';

export * from '@tramvai/tokens-metrics';

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
      scope: Scope.SINGLETON,
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
      useFactory: ({ app, registry }) => {
        return async () => {
          app.all('/metrics', async (_, res) => {
            res.type(registry.contentType);

            return registry.metrics();
          });
        };
      },
      deps: {
        app: UTILITY_WEB_FASTIFY_APP_TOKEN,
        registry: 'metricsDefaultRegistry',
      },
      multi: true,
    }),
    provide({
      provide: WEB_FASTIFY_APP_INIT_TOKEN,
      useFactory: ({
        app,
        metrics,
        additionalLabelNamesList,
        getAdditionalLabelValuesList,
        httpRequestsDurationBuckets,
        metricsExcludePaths,
      }) => {
        return async () => {
          await app.register(fastifyMeasureRequests, {
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
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
        app: UTILITY_WEB_FASTIFY_APP_TOKEN,
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
        metricsExcludePaths: UTILITY_SERVER_PATHS,
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
