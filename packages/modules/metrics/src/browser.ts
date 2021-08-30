import { Scope, Module, commandLineListTokens } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import { browserTimings } from '@tinkoff/browser-timings';
import { Counter, Gauge, Histogram, Summary } from '@tinkoff/metrics-noop';
import { InstantMetricsModule } from './instantMetrics/browser';
import { PerfGauge, PerfSummary, PerfHistogram } from './performance-devtools/PerfMetrics';

@Module({
  imports: [InstantMetricsModule],
  providers: [
    {
      provide: METRICS_MODULE_TOKEN,
      useFactory: (): typeof METRICS_MODULE_TOKEN => {
        if (process.env.NODE_ENV === 'development') {
          return {
            counter: (opt) => new Counter({ ...opt }),
            gauge: (opt) => new PerfGauge({ ...opt }),
            histogram: (opt) => new PerfHistogram({ ...opt }),
            summary: (opt) => new PerfSummary({ ...opt }),
          };
        }

        return {
          counter: (opt) => new Counter({ ...opt }),
          gauge: (opt) => new Gauge({ ...opt }),
          histogram: (opt) => new Histogram({ ...opt }),
          summary: (opt) => new Summary({ ...opt }),
        };
      },
      scope: Scope.SINGLETON,
    },
    {
      provide: commandLineListTokens.init,
      useFactory: ({ logger }) => () => {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const timings = browserTimings();

            const log = logger({
              name: 'metrics:perf',
              defaults: {
                remote: {
                  emitLevels: {
                    info: true,
                  },
                },
              },
            });

            log.info({
              ...timings,
              event: 'perf-timings',
            });
          }, 0);
        });
      },
      multi: true,
      deps: {
        logger: LOGGER_TOKEN,
      },
    },
  ],
})
export class MetricsModule {}
