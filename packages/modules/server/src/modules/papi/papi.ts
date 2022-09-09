import flatten from '@tinkoff/utils/array/flatten';

import { Module, DI_TOKEN, provide } from '@tramvai/core';
import toArray from '@tinkoff/utils/array/toArray';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import {
  SERVER_MODULE_PAPI_PRIVATE_ROUTE,
  SERVER_MODULE_PAPI_PUBLIC_ROUTE,
  SERVER_MODULE_PAPI_PRIVATE_URL,
  SERVER_MODULE_PAPI_PUBLIC_URL,
} from '@tramvai/tokens-server';
import { WEB_FASTIFY_APP_BEFORE_INIT_TOKEN } from '@tramvai/tokens-server-private';
import type { Papi } from '@tramvai/papi';
import { createPapiMethod, getPapiParameters } from '@tramvai/papi';
import { createApi } from './api';
import { fileApiProvider } from './server/fileApi';
import { sharedProviders } from './shared';
import { papiExecutorProvider } from './server/executor';

@Module({
  providers: [
    papiExecutorProvider,
    fileApiProvider,
    ...sharedProviders,
    provide({
      provide: WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
      useFactory: ({ di, logger, privateRoutes, publicRoutes, publicBaseUrl, privateBaseUrl }) => (
        app
      ) => {
        if (process.env.NODE_ENV === 'development') {
          const papiListRoute = createPapiMethod({
            method: 'get',
            path: '/papi-list',
            async handler() {
              return [
                ...flatten<Papi>(privateRoutes).map((papi) => {
                  const params = getPapiParameters(papi);
                  return {
                    path: params.path,
                    method: params.method,
                    options: params.options,
                    type: 'private',
                  };
                }),
                ...flatten<Papi>(publicRoutes).map((papi) => {
                  const params = getPapiParameters(papi);
                  return {
                    path: params.path,
                    method: params.method,
                    options: params.options,
                    type: 'public',
                  };
                }),
              ];
            },
          });
          // eslint-disable-next-line no-param-reassign
          privateRoutes = privateRoutes
            ? [...toArray(privateRoutes), papiListRoute]
            : [papiListRoute];
        }

        if (privateRoutes) {
          createApi(app, flatten(privateRoutes), {
            baseUrl: privateBaseUrl,
            di,
            logger,
          });
        }

        if (publicRoutes) {
          createApi(app, flatten(publicRoutes), {
            baseUrl: publicBaseUrl,
            di,
            logger,
          });
        }
      },
      deps: {
        di: DI_TOKEN,
        logger: LOGGER_TOKEN,
        privateRoutes: {
          token: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
          optional: true as const,
          multi: true as const,
        },
        publicRoutes: {
          token: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
          optional: true as const,
          multi: true as const,
        },
        privateBaseUrl: SERVER_MODULE_PAPI_PRIVATE_URL,
        publicBaseUrl: SERVER_MODULE_PAPI_PUBLIC_URL,
      },
      multi: true,
    }),
    // необходимо для утилит. Подумать как можно убрать в будующем. Если убрать не будет ломающим изменением
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get',
        path: '/version',
        async handler() {
          return {
            version: this.deps.envManager.get('APP_VERSION'),
          };
        },
        deps: {
          envManager: ENV_MANAGER_TOKEN,
        },
      }),
    }),
  ],
})
export class ServerPapiModule {}
