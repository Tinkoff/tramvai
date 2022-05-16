import fastify from 'fastify';
import express from 'express';
import { fastifyCookie } from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { FASTIFY_REQUEST, FASTIFY_RESPONSE } from '@tramvai/tokens-common';
import { REQUEST, RESPONSE, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import type { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import type {
  WEB_APP_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  WEB_APP_INIT_TOKEN,
  WEB_APP_AFTER_INIT_TOKEN,
  WEB_APP_LIMITER_TOKEN,
  SERVER_TOKEN,
} from '@tramvai/tokens-server';
import type {
  WEB_FASTIFY_APP_TOKEN,
  WEB_FASTIFY_APP_AFTER_INIT_TOKEN,
  WEB_FASTIFY_APP_BEFORE_INIT_TOKEN,
  WEB_FASTIFY_APP_INIT_TOKEN,
  WEB_FASTIFY_APP_LIMITER_TOKEN,
  WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN,
  WEB_FASTIFY_APP_AFTER_ERROR_TOKEN,
  WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN,
} from '@tramvai/tokens-server-private';
import { fastifyExpressCompatibility } from './express-compatibility';
import { errorHandler } from './error';

export const webAppFactory = ({ server }: { server: typeof SERVER_TOKEN }) => {
  const app = fastify({
    serverFactory: (handler) => {
      server.on('request', handler);

      return server;
    },
  });

  return app;
};

export const webAppExpressFactory = ({ webApp }: { webApp: typeof WEB_FASTIFY_APP_TOKEN }) => {
  const app = express();

  app.disable('etag');
  app.disable('x-powered-by');

  return app;
};

export const webAppInitCommand = ({
  app,
  expressApp,
  logger,
  commandLineRunner,
  beforeInit,
  limiterRequest,
  init,
  afterInit,
  expressBeforeInit,
  expressInit,
  expressAfterInit,
  expressLimiterRequest,
  beforeError,
  processError,
  afterError,
}: {
  app: typeof WEB_FASTIFY_APP_TOKEN;
  expressApp: typeof WEB_APP_TOKEN;
  logger: typeof LOGGER_TOKEN;
  commandLineRunner: typeof COMMAND_LINE_RUNNER_TOKEN;
  beforeInit: typeof WEB_FASTIFY_APP_BEFORE_INIT_TOKEN;
  limiterRequest: typeof WEB_FASTIFY_APP_LIMITER_TOKEN;
  init: typeof WEB_FASTIFY_APP_INIT_TOKEN;
  afterInit: typeof WEB_FASTIFY_APP_AFTER_INIT_TOKEN;
  expressBeforeInit: typeof WEB_APP_BEFORE_INIT_TOKEN;
  expressInit: typeof WEB_APP_INIT_TOKEN;
  expressAfterInit: typeof WEB_APP_AFTER_INIT_TOKEN;
  expressLimiterRequest: typeof WEB_APP_LIMITER_TOKEN;
  beforeError: typeof WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN;
  processError: typeof WEB_FASTIFY_APP_PROCESS_ERROR_TOKEN;
  afterError: typeof WEB_FASTIFY_APP_AFTER_ERROR_TOKEN;
}) => {
  const log = logger('server:webapp');

  const runHandlers = (
    instance: typeof WEB_FASTIFY_APP_TOKEN,
    handlers: typeof WEB_FASTIFY_APP_INIT_TOKEN,
    expressHandlers: typeof WEB_APP_INIT_TOKEN
  ) => {
    return Promise.all([
      handlers && Promise.all(handlers.map((handler) => handler(instance))),
      expressHandlers && Promise.all(expressHandlers.map((handler) => handler(expressApp))),
    ]);
  };

  return async function webAppInit() {
    errorHandler(app, { log, beforeError, processError, afterError });

    await app.register(fastifyExpressCompatibility, {
      express: {
        instance: expressApp,
      },
    });

    await app.register(async (instance) => {
      await runHandlers(instance, beforeInit, expressBeforeInit);
    });

    await app.register(async (instance) => {
      await runHandlers(instance, limiterRequest, expressLimiterRequest);

      await app.register(fastifyCookie);
      await app.register(fastifyFormBody, { bodyLimit: 2097152 }); // 2mb

      await runHandlers(instance, init, expressInit);

      // force express to execute to update server's request and response instances
      instance.use((req, res, next) => {
        next();
      });

      instance.all('*', async (request, reply) => {
        try {
          log.debug({
            event: 'start:request',
            message: 'Клиент зашел на страницу',
            url: request.url,
          });

          const di = await commandLineRunner.run('server', 'customer', [
            {
              provide: REQUEST,
              scope: Scope.REQUEST,
              useValue: request.raw,
            },
            {
              provide: RESPONSE,
              scope: Scope.REQUEST,
              useValue: reply.raw,
            },
            // TODO: перевести использование на новые
            // TODO: добавить для papi
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
        } catch (err) {
          if (err.di) {
            const responseManager: typeof RESPONSE_MANAGER_TOKEN = err.di.get(
              RESPONSE_MANAGER_TOKEN
            );

            if (responseManager && !reply.sent) {
              reply.headers(responseManager.getHeaders());
            }
          }

          throw err;
        }
      });
    });

    await app.register(async (instance) => {
      await runHandlers(app, afterInit, expressAfterInit);
    });

    await app.ready();
  };
};
