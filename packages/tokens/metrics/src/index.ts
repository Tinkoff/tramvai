import { createToken } from '@tinkoff/dippy';
import type {
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Summary,
  SummaryConfiguration,
} from 'prom-client';

interface Metrics {
  counter<T extends string = string>(opt: CounterConfiguration<T>): Counter<T>;
  gauge<T extends string = string>(opt: GaugeConfiguration<T>): Gauge<T>;
  histogram<T extends string = string>(opt: HistogramConfiguration<T>): Histogram<T>;
  summary<T extends string = string>(opt: SummaryConfiguration<T>): Summary<T>;
}

export type ModuleConfig = {
  enableConnectionResolveMetrics: boolean;
};

export { Counter, Gauge, Histogram, Summary, Metrics };

/**
 * @description
 * Metric module implementation
 */
export const METRICS_MODULE_TOKEN = createToken<Metrics>('metricsModule');

export interface MetricsServicesRegistryInterface {
  register(url: string, serviceName: string): void;
  registerEnv(env: Record<string, unknown>): void;
  getServiceName(url: string): string | void;
}

/**
 * @description
 * Utility for pointing out to metric module which service name to set for different requests
 */
export const METRICS_SERVICES_REGISTRY_TOKEN = createToken<MetricsServicesRegistryInterface>(
  'metricsServicesRegistry'
);

/**
 * @description
 * Token for registering counter metric which can be incremented with POST papi request
 */
export const REGISTER_INSTANT_METRIC_TOKEN = createToken<[string, Counter<string>]>(
  'registerInstantMetric'
);

/**
 * @description
 * Configuration for the metrics
 */
export const METRICS_MODULE_CONFIG_TOKEN = createToken<ModuleConfig>('metrics-module-config');
