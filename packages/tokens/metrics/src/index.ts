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

export { Counter, Gauge, Histogram, Summary, Metrics };

/**
 * @description
 * Реализация модуля метрик
 */
export const METRICS_MODULE_TOKEN = createToken<Metrics>('metricsModule');

export interface MetricsServicesRegistryInterface {
  register(url: string, serviceName: string): void;
  registerEnv(env: Record<string, unknown>): void;
  getServiceName(url: string): string | void;
}

/**
 * @description
 * Утилита для того чтобы указать модулю метрик какое имя сервиса подставлять для разных запросов
 */
export const METRICS_SERVICES_REGISTRY_TOKEN = createToken<MetricsServicesRegistryInterface>(
  'metricsServicesRegistry'
);

/**
 * @description
 * Токен для регистрации counter-метрик которые затем можно будет инктерементировать через POST
 * запрос papi роута
 */
export const REGISTER_INSTANT_METRIC_TOKEN = createToken<[string, Counter<string>]>(
  'registerInstantMetric'
);
