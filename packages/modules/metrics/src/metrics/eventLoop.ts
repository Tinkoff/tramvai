import type { Metrics } from '@tramvai/tokens-metrics';
import type { Histogram } from 'prom-client';

const NODEJS_EVENTLOOP_LAG = 'nodejs_eventloop_setinterval_lag_seconds';
const RESOLUTION = 100;

function startEventLoopLagMeasure(histogram: Histogram<string>) {
  let start = process.hrtime();

  const measure = () => {
    const delta = process.hrtime(start);
    const nanosec = delta[0] * 1e9 + delta[1];
    const ms = nanosec / 1e6;
    const lag = ms - RESOLUTION;

    histogram.observe(lag / 1e3);
    start = process.hrtime();
    setTimeout(measure, RESOLUTION).unref();
  };

  setTimeout(measure, RESOLUTION).unref();
}

export const eventLoopMetrics = (metrics: Metrics) => {
  const histogram = metrics.histogram({
    name: NODEJS_EVENTLOOP_LAG,
    help: 'Lag of event loop in seconds (setTimeout based).',
    buckets: [0.01, 0.02, 0.1, 0.2, 0.5, 1, 3, 5, 7.5, 10],
  });

  startEventLoopLagMeasure(histogram);
};
