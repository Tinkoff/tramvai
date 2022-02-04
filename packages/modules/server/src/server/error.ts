import type express from 'express';
import type { Request, Response } from 'express';
import finalhandler from 'finalhandler';
import { isNotFoundError, isRedirectFoundError, isHttpError } from '@tinkoff/errors';
import type { LOGGER_TOKEN } from '@tramvai/module-common';

export const routerErrorHandler = (app: express.Application) => {
  app.use((err, req: Request, res: Response, next) => {
    if (isRedirectFoundError(err)) {
      res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
      return res.redirect(err.httpStatus || 307, err.nextUrl);
    }

    if (isNotFoundError(err)) {
      return res.status(404).end();
    }

    next(err);
  });
};

export const errorHandler = (
  app: express.Application,
  {
    log,
  }: {
    log: ReturnType<typeof LOGGER_TOKEN>;
  }
) => {
  app.use(async (err, req: Request, res: Response, next) => {
    const requestInfo = {
      ip: req.ip,
      requestId: req.headers['x-request-id'],
      url: req.url,
    };

    if (isHttpError(err)) {
      if (err.httpStatus >= 500) {
        log.error({ event: 'send-server-error', error: err, requestInfo });
      }

      return res.status(err.httpStatus).end();
    }

    log.error({ event: 'send-server-error', error: err, requestInfo });

    finalhandler(req, res)(err);
  });
};
