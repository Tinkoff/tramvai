import type { FastifyInstance, FastifySchema } from 'fastify';
import { fastifyCookie } from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';

import type { Papi } from '@tramvai/papi';
import { getPapiParameters } from '@tramvai/papi';
import type { DI_TOKEN } from '@tramvai/core';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { FASTIFY_REQUEST, FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';
import { Scope, createChildContainer } from '@tinkoff/dippy';
import { HttpError } from '@tinkoff/errors';
import { PAPI_EXECUTOR } from '@tramvai/tokens-server-private';

export interface CreateOptions {
  baseUrl: string;
  di: typeof DI_TOKEN;
  logger: typeof LOGGER_TOKEN;
}

export function createApi(
  rootApp: FastifyInstance,
  papiList: Papi[],
  { baseUrl, di, logger }: CreateOptions
) {
  const paths = new Set();
  const papiLog = logger('papi');

  rootApp.register(
    async (app) => {
      await app.register(fastifyCookie);
      await app.register(fastifyFormBody, { bodyLimit: 2097152 }); // 2mb

      for (const papi of papiList) {
        const papiParams = getPapiParameters(papi);

        if (!papiParams) {
          throw new Error(`papi should be created using createPapiMethod from @tramvai/papi,
        got: ${JSON.stringify(papi)}`);
        }

        const { method, path, options } = papiParams;
        const { timeout, schema } = options;

        if (!path) {
          throw new Error(`No path in papi handler, got: ${JSON.stringify(papi)}`);
        }

        const key = `${method} ${path}`;

        if (paths.has(key)) {
          throw new Error(`papi: route '${key}' already registered`);
        }

        paths.add(key);

        const childLog = papiLog.child(`${papiParams.method}_${papiParams.path}`);

        app[method](
          path,
          {
            schema,
            errorHandler: async (error, req, res) => {
              res.status(error.validation ? 400 : 503);

              childLog.error(error);

              return {
                resultCode: 'INTERNAL_ERROR',
                errorMessage: error.message ?? 'internal error',
              };
            },
          },
          async (req, res) => {
            const childDi = createChildContainer(di, [
              {
                provide: FASTIFY_REQUEST,
                scope: Scope.REQUEST,
                useValue: req,
              },
              {
                provide: FASTIFY_RESPONSE,
                scope: Scope.REQUEST,
                useValue: res,
              },
            ]);

            const papiExecutor = childDi.get(PAPI_EXECUTOR);

            // TODO: use abortSignal
            const payload = await Promise.race([
              papiExecutor(papi),
              new Promise((resolve, reject) =>
                setTimeout(
                  () => reject(new HttpError({ httpStatus: 503, message: 'Execution timeout' })),
                  timeout
                )
              ),
            ]);

            const responseManager = childDi.get(RESPONSE_MANAGER_TOKEN);

            res.headers(responseManager.getHeaders()).status(responseManager.getStatus());

            if (res.sent) {
              return;
            }

            if (!payload && responseManager.getBody()) {
              res.send(responseManager.getBody());
              return res;
            }

            return {
              resultCode: 'OK',
              payload,
            };
          }
        );
      }
    },
    { prefix: baseUrl }
  );
}
