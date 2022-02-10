import type { Request, Response, NextFunction } from 'express';
import onFinished from 'on-finished';
// @ts-ignore
import pathToRegexp from 'path-to-regexp';
import flatten from '@tinkoff/utils/array/flatten';
import type { Counter, Histogram } from 'prom-client';

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
  getAdditionalLabelValues?: (req: Request, res: Response) => LabelValues<T>;
  httpRequestsDurationBuckets?: number[];
}

export function measure<T extends string = string>({
  metrics,
  metricsExcludePaths = [],
  additionalLabelNames = [],
  getAdditionalLabelValues = () => ({} as LabelValues<T>),
  httpRequestsDurationBuckets,
}: MeasureOptions<T>) {
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

  const excludePatterns = flatten(metricsExcludePaths).map((p) =>
    pathToRegexp(p, {
      strict: false,
    })
  );

  return (req: Request, res: Response, next: NextFunction) => {
    if (excludePatterns.some((p) => p.test(req.path))) {
      next();
      return;
    }

    requestInit.inc();

    const done = duration.startTimer();

    onFinished(res, (err) => {
      const labels = {
        method: req.method,
        status: res.statusCode,
        ...getAdditionalLabelValues(req, res),
      };

      request.inc(labels);

      if (err || res.statusCode >= 400) {
        error.inc(labels);
      }

      done(labels);
    });

    next();
  };
}
