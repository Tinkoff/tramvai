import { Scope, Module, commandLineListTokens } from '@tramvai/core';
import { METRICS_MODULE_TOKEN, METRICS_SERVICES_REGISTRY_TOKEN } from '@tramvai/tokens-metrics';
import { ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import noop from '@tinkoff/utils/function/noop';
import https from 'https';
import http from 'http';
import { createRequestWithMetrics } from './createRequestWithMetrics';
import { initRequestsMetrics } from './initRequestsMetrics';
import { MetricsServicesRegistry } from './MetricsServicesRegistry';

@Module({
  providers: [
    {
      provide: commandLineListTokens.init,
      multi: true,
      useFactory: ({ metrics, envManager, metricsServicesRegistry }) => {
        if (!metrics) {
          return noop;
        }

        return () => {
          const env = envManager.getAll();
          metricsServicesRegistry.registerEnv(env);

          const getServiceName = metricsServicesRegistry.getServiceName.bind(
            metricsServicesRegistry
          );

          initRequestsMetrics({ metrics, getServiceName, http, https, createRequestWithMetrics });
        };
      },
      deps: {
        metrics: {
          token: METRICS_MODULE_TOKEN,
          optional: true,
        },
        metricsServicesRegistry: METRICS_SERVICES_REGISTRY_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
      },
    },
    {
      provide: METRICS_SERVICES_REGISTRY_TOKEN,
      useClass: MetricsServicesRegistry,
      scope: Scope.SINGLETON,
    },
  ],
})
export class RequestModule {}
