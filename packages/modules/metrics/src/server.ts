import { Scope, Module } from '@tramvai/core';
import {
  WEB_APP_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  SPECIAL_SERVER_PATHS,
} from '@tramvai/tokens-server';
import { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import { measure } from '@tinkoff/measure-express-requests';
import { Registry, Counter, Gauge, Histogram, Summary, collectDefaultMetrics } from 'prom-client';
import flatten from '@tinkoff/utils/array/flatten';
import { RequestModule } from './request';
import { InstantMetricsModule } from './instantMetrics/server';
import { eventLoopMetrics } from './metrics/eventLoop';

@Module({
  imports: [RequestModule, InstantMetricsModule],
  providers: [
    {
      provide: 'metricsDefaultRegistry',
      useClass: Registry,
    },
    {
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
    },
    {
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      useFactory: ({
        metrics,
        app,
        additionalLabelNamesList,
        getAdditionalLabelValuesList,
        httpRequestsDurationBuckets,
        metricsExcludePaths,
        registry,
      }) => {
        return () => {
          app.use('/metrics', (req, res, next) => {
            res.type(registry.contentType);
            res.send(registry.metrics());
          });

          app.use(
            measure({
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
            })
          );
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
        app: WEB_APP_TOKEN,
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
    },
    {
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      useFactory: ({ metrics }) => {
        return () => {
          eventLoopMetrics(metrics);
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
      },
      multi: true,
    },
  ],
})
export class MetricsModule {}
