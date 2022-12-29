import type { COMMAND_LINE_EXECUTION_END_TOKEN } from '@tramvai/tokens-core-private';
import type { Metrics } from '@tramvai/tokens-metrics';
import { DEFAULT_BUCKETS } from '../constants';

export const commandLineMetrics = (metrics: Metrics): typeof COMMAND_LINE_EXECUTION_END_TOKEN => {
  const metricsInstance = metrics.histogram({
    name: `command_line_runner_execution_time`,
    help: 'Command line processing duration',
    labelNames: ['line'],
    buckets: DEFAULT_BUCKETS,
  });

  return (di, type, status, timingInfo) => {
    for (const line in timingInfo) {
      const info = timingInfo[line];
      if (info.end) {
        const durationInMs = info.end - info.start;
        const durationInSec = durationInMs / 1000;

        metricsInstance.observe({ line }, durationInSec);
      }
    }
  };
};
