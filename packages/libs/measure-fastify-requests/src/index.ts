import noop from '@tinkoff/utils/function/noop';
import flatten from '@tinkoff/utils/array/flatten';

import type { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
// @ts-ignore
import pathToRegexp from 'path-to-regexp';
import type { Counter, Histogram } from 'prom-client';

const METRICS_FASTIFY_HANDLED = '_metrics_handled';
const METRICS_FASTIFY_TIMER = '_metrics_execution_timer';

declare module 'fastify' {
  interface FastifyRequest {
    [METRICS_FASTIFY_HANDLED]: boolean;
    [METRICS_FASTIFY_TIMER]: (labels?: Record<string, any>) => void;
  }
}

const LABEL_NAMES = ['method', 'status'];
const DEFAULT_BUCKETS = [0.01, 0.05, 0.1, 0.3, 0.4, 0.5, 1, 2.5, 5, 10, 20, 40, 60];

type CounterConfiguration = {
  name: string;
  help: string;
  labelNames: string[];
};

type HistogramConfiguration = {
  name: string;
  help: string;
  buckets: number[];
  labelNames: string[];
};

interface Metrics<T extends string> {
  counter: (CounterConfiguration: CounterConfiguration) => Counter<T>;
  histogram: (HistogramConfiguration: HistogramConfiguration) => Histogram<T>;
}

export type LabelValues<T extends string = string> = Record<T, string | number>;

interface MeasureOptions<T extends string> {
  metrics: Metrics<T>;
  metricsExcludePaths: string[];
  additionalLabelNames?: T[];
  getAdditionalLabelValues?: (req: FastifyRequest, res: FastifyReply) => LabelValues<T>;
  httpRequestsDurationBuckets?: number[];
}

export const fastifyMeasureRequests = fp<MeasureOptions<any>>(
  async (
    fastify,
    {
      metrics,
      additionalLabelNames = [],
      httpRequestsDurationBuckets,
      metricsExcludePaths = [],
      getAdditionalLabelValues = () => ({} as LabelValues<any>),
    }
  ) => {
    const labelNames = LABEL_NAMES.concat(additionalLabelNames);

    const requestInit = metrics.counter({
      name: 'http_requests_init_total',
      help: 'Total HTTP requests received',
      labelNames: [],
    });
    const request = metrics.counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests processed',
      labelNames,
    });
    const error = metrics.counter({
      name: 'http_requests_errors',
      help: 'HTTP requests failed to process',
      labelNames,
    });
    const duration = metrics.histogram({
      name: 'http_requests_execution_time',
      help: 'HTTP requests processing duration',
      buckets: httpRequestsDurationBuckets || DEFAULT_BUCKETS,
      labelNames,
    });

    const excludePatterns = flatten(metricsExcludePaths).map((p) => pathToRegexp(p));

    fastify.decorateRequest(METRICS_FASTIFY_HANDLED, false);
    fastify.decorateRequest(METRICS_FASTIFY_TIMER, noop);

    fastify.addHook('onRequest', async (req) => {
      if (!excludePatterns.some((p) => p.test(req.url))) {
        requestInit.inc();
        req[METRICS_FASTIFY_HANDLED] = true;
        req[METRICS_FASTIFY_TIMER] = duration.startTimer();
      }
    });

    fastify.addHook('onResponse', async (req, res) => {
      if (req[METRICS_FASTIFY_HANDLED]) {
        const labels = {
          method: req.method,
          status: res.statusCode,
          ...getAdditionalLabelValues(req, res),
        };

        if (res.statusCode >= 400) {
          error.inc(labels);
        }

        request.inc(labels);
        req[METRICS_FASTIFY_TIMER](labels);
      }
    });
  }
);
