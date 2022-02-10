import monkeypatch from '@tinkoff/monkeypatch';
import type {
  MetricsModule,
  GetServiceName,
  CreateRequestWithMetrics,
  MetricsInstances,
  HttpModule,
  HttpsModule,
  ModuleConfig,
} from './types';

export const initRequestsMetrics = ({
  metrics,
  getServiceName,
  http,
  https,
  createRequestWithMetrics,
  config,
}: {
  metrics: MetricsModule;
  http: HttpModule;
  https: HttpsModule;
  createRequestWithMetrics: CreateRequestWithMetrics;
  getServiceName: GetServiceName;
  config: ModuleConfig;
}) => {
  const metricsInstances: MetricsInstances = {
    requestsTotal: metrics.counter({
      name: 'http_sent_requests_total',
      help: 'Number of requests sent',
      labelNames: ['status', 'method', 'service'],
    }),
    requestsErrors: metrics.counter({
      name: 'http_sent_requests_errors',
      help: 'Number of requests that failed',
      labelNames: ['status', 'method', 'service'],
    }),
    requestsDuration: metrics.histogram({
      name: 'http_sent_requests_duration',
      help: 'Execution time of the sent requests',
      labelNames: ['status', 'method', 'service'],
    }),
    dnsResolveDuration: metrics.histogram({
      name: 'dns_resolve_duration',
      help: 'Time for dns resolve of the outhgoing requests',
      labelNames: ['service'],
    }),
  };

  monkeypatch({
    obj: https,
    method: 'request',
    handler: createRequestWithMetrics({ metricsInstances, getServiceName, config }),
  });
  monkeypatch({
    obj: http,
    method: 'request',
    handler: createRequestWithMetrics({ metricsInstances, getServiceName, config }),
  });
};
