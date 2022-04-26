import { createApp, commandLineListTokens, provide } from '@tramvai/core';
import { MetricsModule, METRICS_MODULE_CONFIG_TOKEN } from '@tramvai/module-metrics';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { METRICS_MODULE_TOKEN, REGISTER_INSTANT_METRIC_TOKEN } from '@tramvai/tokens-metrics';
import { modules, bundles } from '../../../../test/shared/common';

createApp({
  name: 'metrics',
  modules: [...modules, MetricsModule],
  providers: [
    provide({
      provide: METRICS_MODULE_CONFIG_TOKEN,
      useValue: {
        enableConnectionResolveMetrics: false,
        port: Number(process.env.METRICS_PORT) || undefined,
      },
    }),
    typeof window === 'undefined'
      ? {
          provide: REGISTER_INSTANT_METRIC_TOKEN,
          multi: true,
          deps: {
            metrics: METRICS_MODULE_TOKEN,
          },
          useFactory({ metrics }) {
            return ['sent-instant-metric', metrics.counter({ name: 'test', help: 'test' })];
          },
        }
      : {
          provide: commandLineListTokens.customerStart,
          multi: true,
          deps: {
            logger: LOGGER_TOKEN,
          },
          useFactory({ logger }) {
            return () => {
              logger.info({ event: 'sent-instant-metric' });
              logger.info({ event: 'didntsend-instant-metric' });
            };
          },
        },
  ],
  bundles,
});
