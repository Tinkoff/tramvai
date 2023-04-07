import fastify from 'fastify';
import { fastifyCookie } from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';
import type { EXECUTION_CONTEXT_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import { ROOT_EXECUTION_CONTEXT_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import type { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import type { SERVER_TOKEN } from '@tramvai/tokens-server';
import { FASTIFY_REQUEST, FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';
import type {
  WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_AFTER_INIT_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
  WEB_FASTIFY_APP_INIT_TOKEN,
  WEB_FASTIFY_APP_LIMITER_TOKEN,
  WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN,
  WEB_FASTIFY_APP_AFTER_ERROR_TOKEN,
  WEB_FASTIFY_APP_METRICS_TOKEN,
} from '@tramvai/tokens-server-private';
import type { FETCH_WEBPACK_STATS_TOKEN } from '@tramvai/tokens-render';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';

import { errorHandler } from './error';

export const webAppFactory = ({ server }: { server: typeof SERVER_TOKEN }) => {
  const app = fastify({
    ignoreTrailingSlash: true,
    bodyLimit: 2097152, // 2mb
    serverFactory: (handler) => {
      server.on('request', handler);

      return server;
    },
  });

  return app;
};

export const webAppInitCommand = ({
  app,
  logger,
  commandLineRunner,
  executionContextManager,
  beforeInit,
  requestMetrics,
  limiterRequest,
  init,
  afterInit,
  beforeError,
  afterError,
  fetchWebpackStats,
}: {
  app: ExtractDependencyType<typeof WEB_FASTIFY_APP_TOKEN>;
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
  commandLineRunner: ExtractDependencyType<typeof COMMAND_LINE_RUNNER_TOKEN>;
  executionContextManager: ExtractDependencyType<typeof EXECUTION_CONTEXT_MANAGER_TOKEN>;
  beforeInit: ExtractDependencyType<typeof WEB_FASTIFY_APP_BEFORE_INIT_TOKEN>;
  requestMetrics: ExtractDependencyType<typeof WEB_FASTIFY_APP_METRICS_TOKEN>;
  limiterRequest: ExtractDependencyType<typeof WEB_FASTIFY_APP_LIMITER_TOKEN>;
  init: ExtractDependencyType<typeof WEB_FASTIFY_APP_INIT_TOKEN>;
  afterInit: ExtractDependencyType<typeof WEB_FASTIFY_APP_AFTER_INIT_TOKEN>;
  beforeError: ExtractDependencyType<typeof WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN>;
  afterError: ExtractDependencyType<typeof WEB_FASTIFY_APP_AFTER_ERROR_TOKEN>;
  fetchWebpackStats: ExtractDependencyType<typeof FETCH_WEBPACK_STATS_TOKEN>;
}) => {
  const log = logger('server:webapp');

  const runHandlers = (
    instance: ExtractDependencyType<typeof WEB_FASTIFY_APP_TOKEN>,
    handlers: ExtractDependencyType<typeof WEB_FASTIFY_APP_INIT_TOKEN>
  ) => {
    return Promise.all([handlers && Promise.all(handlers.map((handler) => handler(instance)))]);
  };

  return async function webAppInit() {
    errorHandler(app, { log, beforeError, afterError, fetchWebpackStats });

    await app.register(async (instance) => {
      await runHandlers(instance, beforeInit);
    });

    await app.register(async (instance) => {
      await runHandlers(instance, requestMetrics);
      await runHandlers(instance, limiterRequest);

      await app.register(fastifyCookie);
      await app.register(fastifyFormBody);

      await runHandlers(instance, init);

      // break the cycle of event loop to allow server to handle other requests
      // while current on is in processing
      // mainly to prevent problems and response hanging in case the response process
      // uses only sync and microtask code
      instance.addHook('preHandler', (req, res, next) => {
        setImmediate(next);
      });

      instance.all('*', async (request, reply) => {
        try {
          log.debug({
            event: 'start:request',
            message: 'Клиент зашел на страницу',
            url: request.url,
          });

          await executionContextManager.withContext(null, 'root', async (rootExecutionContext) => {
            const di = await commandLineRunner.run('server', 'customer', [
              provide({
                provide: ROOT_EXECUTION_CONTEXT_TOKEN,
                useValue: rootExecutionContext,
              }),
              {
                provide: FASTIFY_REQUEST,
                scope: Scope.REQUEST,
                useValue: request,
              },
              {
                provide: FASTIFY_RESPONSE,
                scope: Scope.REQUEST,
                useValue: reply,
              },
            ]);
            const responseManager = di.get(RESPONSE_MANAGER_TOKEN);

            if (reply.sent) {
              log.debug({
                event: 'response-ended',
                message: 'Response was already ended.',
                url: request.url,
              });
            } else {
              reply
                .header('content-type', 'text/html')
                .headers(responseManager.getHeaders())
                .status(responseManager.getStatus())
                .send(responseManager.getBody());
            }
          });
        } catch (err) {
          if (err.di) {
            const responseManager: typeof RESPONSE_MANAGER_TOKEN =
              err.di.get(RESPONSE_MANAGER_TOKEN);

            if (responseManager && !reply.sent) {
              reply.headers(responseManager.getHeaders());
            }
          }

          throw err;
        }
      });
    });

    await app.register(async (instance) => {
      await runHandlers(instance, afterInit);
    });

    await app.ready();
  };
};
