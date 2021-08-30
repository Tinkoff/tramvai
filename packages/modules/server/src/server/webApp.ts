import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import type { LOGGER_TOKEN } from '@tramvai/module-common';
import { REQUEST, RESPONSE, RESPONSE_MANAGER_TOKEN } from '@tramvai/module-common';
import type { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { Scope } from '@tramvai/core';
import type {
  WEB_APP_TOKEN,
  WEB_APP_BEFORE_INIT_TOKEN,
  WEB_APP_INIT_TOKEN,
  WEB_APP_AFTER_INIT_TOKEN,
} from '@tramvai/tokens-server';
import { errorHandler, routerErrorHandler } from './error';

export const webAppFactory = () => {
  const app = express();

  app.disable('etag');
  app.disable('x-powered-by');

  return app;
};

export const webAppInitCommand = ({
  app,
  logger,
  commandLineRunner,
  beforeInit,
  init,
  afterInit,
}: {
  app: typeof WEB_APP_TOKEN;
  logger: typeof LOGGER_TOKEN;
  commandLineRunner: typeof COMMAND_LINE_RUNNER_TOKEN;
  beforeInit: typeof WEB_APP_BEFORE_INIT_TOKEN;
  init: typeof WEB_APP_INIT_TOKEN;
  afterInit: typeof WEB_APP_AFTER_INIT_TOKEN;
}) => {
  const log = logger('server:webapp');

  const runHandlers = (handlers: typeof WEB_APP_INIT_TOKEN) => {
    if (handlers) {
      return Promise.all(handlers.map((handler) => handler(app)));
    }
  };

  return async function webAppInit() {
    await runHandlers(beforeInit);

    app.use(
      bodyParser.urlencoded({
        limit: '500kb',
        extended: false,
      }),
      cookieParser()
    );

    await runHandlers(init);

    app.use(async (req, res, next) => {
      try {
        log.debug({
          event: 'start:request',
          message: 'Клиент зашел на страницу',
          url: req.url,
        });

        const di = await commandLineRunner.run('server', 'customer', [
          {
            provide: REQUEST,
            scope: Scope.REQUEST,
            useValue: req,
          },
          {
            provide: RESPONSE,
            scope: Scope.REQUEST,
            useValue: res,
          },
        ]);
        const responseManager = di.get(RESPONSE_MANAGER_TOKEN);

        res
          .set('content-type', 'text/html')
          .set(responseManager.getHeaders())
          .status(responseManager.getStatus())
          .send(responseManager.getBody());
      } catch (err) {
        if (err.di) {
          const responseManager: typeof RESPONSE_MANAGER_TOKEN = err.di.get(RESPONSE_MANAGER_TOKEN);

          if (responseManager) {
            res.set(responseManager.getHeaders());
          }
        }

        next(err);
      }
    });

    routerErrorHandler(app);

    await runHandlers(afterInit);

    errorHandler(app, { log });
  };
};
