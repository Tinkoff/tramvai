import monkeypatch from '@tinkoff/monkeypatch';

export const initRequestsMetrics = ({
  metrics,
  getServiceName,
  http,
  https,
  createRequestWithMetrics,
}) => {
  const metricsInstances = {
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
  };

  monkeypatch({
    obj: https,
    method: 'request',
    handler: createRequestWithMetrics({ metricsInstances, getServiceName }),
  });
  monkeypatch({
    obj: http,
    method: 'request',
    handler: createRequestWithMetrics({ metricsInstances, getServiceName }),
  });
};
