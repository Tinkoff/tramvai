import { Scope, Module, provide, commandLineListTokens, createToken } from '@tramvai/core';
import { SERVER_TOKEN } from '@tramvai/tokens-server';
import { SPECIAL_SERVER_PATHS } from '@tramvai/tokens-server';
import {
  WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
  SERVER_FACTORY_TOKEN,
  WEB_FASTIFY_APP_FACTORY_TOKEN,
} from '@tramvai/tokens-server-private';
import { METRICS_MODULE_TOKEN, METRICS_MODULE_CONFIG_TOKEN } from '@tramvai/tokens-metrics';
import { measure } from '@tinkoff/measure-express-requests';
import { Registry, Counter, Gauge, Histogram, Summary, collectDefaultMetrics } from 'prom-client';
import flatten from '@tinkoff/utils/array/flatten';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import { RequestModule } from './request';
import { InstantMetricsModule } from './instantMetrics/server';
import { eventLoopMetrics } from './metrics/eventLoop';

export * from '@tramvai/tokens-metrics';

const METRICS_IS_CUSTOM_SERVER_TOKEN = createToken<boolean>('metrics isCustomServer');
const METRICS_SERVER_TOKEN = createToken<typeof SERVER_TOKEN>('metrics server');
const METRICS_WEB_APP_TOKEN = createToken<typeof WEB_FASTIFY_APP_TOKEN>('metrics webApp');

@Module({
  imports: [RequestModule, InstantMetricsModule],
  providers: [
    provide({
      provide: METRICS_MODULE_CONFIG_TOKEN,
      useValue: {
        enableConnectionResolveMetrics: false,
      },
    }),
    provide({
      provide: 'metricsDefaultRegistry',
      useClass: Registry,
    }),
    provide({
      provide: METRICS_MODULE_TOKEN,
      useFactory: ({ registry }): typeof METRICS_MODULE_TOKEN => {
        collectDefaultMetrics({ register: registry });

        return {
          counter: (opt) => new Counter({ registers: [registry], ...opt }),
          gauge: (opt) => new Gauge({ registers: [registry], ...opt }),
          histogram: (opt) => new Histogram({ registers: [registry], ...opt }),
          summary: (opt) => new Summary({ registers: [registry], ...opt }),
        };
      },
      scope: Scope.SINGLETON,
      deps: {
        registry: 'metricsDefaultRegistry',
      },
    }),
    provide({
      provide: METRICS_IS_CUSTOM_SERVER_TOKEN,
      useFactory: ({ config, envManager }) => {
        return config.port && +envManager.get('PORT') !== config.port;
      },
      deps: {
        envManager: ENV_MANAGER_TOKEN,
        config: METRICS_MODULE_CONFIG_TOKEN,
      },
    }),
    provide({
      provide: METRICS_SERVER_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ isCustomServer, serverFactory, server }) => {
        return isCustomServer ? serverFactory() : server;
      },
      deps: {
        isCustomServer: METRICS_IS_CUSTOM_SERVER_TOKEN,
        server: SERVER_TOKEN,
        serverFactory: SERVER_FACTORY_TOKEN,
      },
    }),
    provide({
      provide: METRICS_WEB_APP_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ isCustomServer, app, appFactory, server }) => {
        return isCustomServer ? appFactory({ server }) : app;
      },
      deps: {
        isCustomServer: METRICS_IS_CUSTOM_SERVER_TOKEN,
        app: WEB_FASTIFY_APP_TOKEN,
        appFactory: WEB_FASTIFY_APP_FACTORY_TOKEN,
        server: METRICS_SERVER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.listen,
      multi: true,
      scope: Scope.SINGLETON,
      useFactory: ({ logger, isCustomServer, config, app, server }) => {
        return async function metricsServerListen() {
          if (!isCustomServer) {
            return;
          }

          const log = logger('metrics:server');
          const { port = 3001 } = config;

          await app.ready();

          return new Promise<void>((resolve, reject) => {
            server.once('error', (error) => {
              log.error({ event: 'server-listen-port', error });
              reject(error);
            });

            server.listen(
              {
                host: '',
                port,
              },
              () => {
                log.warn({ event: 'server-listen-port', message: `Server listen ${port} port` });
                resolve();
              }
            );
          });
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        isCustomServer: METRICS_IS_CUSTOM_SERVER_TOKEN,
        config: METRICS_MODULE_CONFIG_TOKEN,
        app: METRICS_WEB_APP_TOKEN,
        server: METRICS_SERVER_TOKEN,
      },
    }),
    provide({
      provide: WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
      useFactory: ({
        app,
        metrics,
        additionalLabelNamesList,
        getAdditionalLabelValuesList,
        httpRequestsDurationBuckets,
        metricsExcludePaths,
        registry,
      }) => {
        return async () => {
          app.all('/metrics', async (_, res) => {
            res.type(registry.contentType);

            return registry.metrics();
          });

          const measured = measure({
            metrics,
            metricsExcludePaths,
            additionalLabelNames: flatten(additionalLabelNamesList || []) as string[],
            getAdditionalLabelValues(req, res) {
              if (!getAdditionalLabelValuesList) {
                return {};
              }

              return getAdditionalLabelValuesList.reduce(
                (labelValues, getLV) => ({
                  ...labelValues,
                  ...getLV(req, res),
                }),
                {}
              );
            },
            httpRequestsDurationBuckets,
          });

          app.addHook('onRequest', (request, reply, next) => {
            measured({ ...request.raw, path: request.url } as any, reply as any, next);
          });
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
        app: METRICS_WEB_APP_TOKEN,
        additionalLabelNamesList: {
          token: 'additionalLabelNames',
          multi: true,
          optional: true,
        },
        getAdditionalLabelValuesList: {
          token: 'getAdditionalLabelValues',
          multi: true,
          optional: true,
        },
        httpRequestsDurationBuckets: {
          token: 'httpRequestsDurationBuckets',
          optional: true,
        },
        metricsExcludePaths: SPECIAL_SERVER_PATHS,
        registry: 'metricsDefaultRegistry',
      },
      multi: true,
    }),
    provide({
      provide: commandLineListTokens.listen,
      useFactory: ({ metrics }) => {
        return () => {
          eventLoopMetrics(metrics);
        };
      },
      deps: {
        metrics: METRICS_MODULE_TOKEN,
      },
      multi: true,
    }),
  ],
})
export class MetricsModule {}
