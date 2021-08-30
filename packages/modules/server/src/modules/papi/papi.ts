import flatten from '@tinkoff/utils/array/flatten';

import { Module, DI_TOKEN, provide } from '@tramvai/core';
import toArray from '@tinkoff/utils/array/toArray';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import {
  SERVER_MODULE_PAPI_PRIVATE_ROUTE,
  SERVER_MODULE_PAPI_PUBLIC_ROUTE,
  WEB_APP_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  SERVER_MODULE_PAPI_PRIVATE_URL,
  SERVER_MODULE_PAPI_PUBLIC_URL,
} from '@tramvai/tokens-server';
import type { Papi } from '@tramvai/papi';
import { createPapiMethod, getPapiParameters } from '@tramvai/papi';
import { createApi } from './api';
import { fileApiProvider } from './fileApi';
import { sharedProviders } from './shared';

@Module({
  providers: [
    fileApiProvider,
    ...sharedProviders,
    provide({
      provide: WEB_APP_BEFORE_INIT_TOKEN,
      useFactory: ({
        di,
        app,
        logger,
        privateRoutes,
        publicRoutes,
        publicBaseUrl,
        privateBaseUrl,
      }) => () => {
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
          const apiPrivate = createApi(flatten(privateRoutes), {
            di,
            logger,
          });
          app.use(privateBaseUrl, apiPrivate);
        }

        if (publicRoutes) {
          const apiPublic = createApi(flatten(publicRoutes), {
            di,
            logger,
          });
          app.use(publicBaseUrl, apiPublic);
        }
      },
      deps: {
        app: WEB_APP_TOKEN,
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
        deps: {
          envManager: ENV_MANAGER_TOKEN,
        },
        async handler(req, res, { envManager }) {
          return {
            version: envManager.get('APP_VERSION'),
          };
        },
      }),
    }),
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          dehydrate: true,
          optional: true,
          key: 'APP_VERSION',
          // обращаемся к process.env.APP_VERSION явно, чтобы вебпак заинлайнил его при сборке и версия вшилась в билд
          value: process.env.APP_VERSION,
        },
      ],
    }),
  ],
})
export class ServerPapiModule {}
