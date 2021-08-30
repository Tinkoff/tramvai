import { MetricsServicesRegistry } from './MetricsServicesRegistry';

describe('initRequestsMetrics', () => {
  it('Correctly compiles a map of service names', () => {
    const metricsServicesRegistry = new MetricsServicesRegistry();

    metricsServicesRegistry.registerEnv({
      undef: undefined,
      number: 500,
      emptyString: '',
      serviceName: 'http://example.com/',
      longServiceName: 'http://example.com/api',
    });

    expect(metricsServicesRegistry.getServiceName('http://example.com/api/foo')).toBe(
      'longServiceName'
    );
  });

  it('Correcty handle case when url passed wo protocol', () => {
    const metricsServicesRegistry = new MetricsServicesRegistry();
    metricsServicesRegistry.register('example.com/', 'SITE');
    expect(metricsServicesRegistry.getServiceName('http://example.com/api')).toBe('SITE');
  });
});
