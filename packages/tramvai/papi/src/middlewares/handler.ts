import type { RequestHandler } from 'express';
import type { MiddlewareCreator } from '../types';

declare module '../types' {
  export interface Options {
    respond?: boolean;
  }
}

export const handler = (): MiddlewareCreator => {
  return (papi): RequestHandler => {
    return async (req, res, next) => {
      try {
        const payload = await papi.handler(res.papiState);

        // Do nothing if response already has been sent (i.e. timeout error)
        if (papi.options.respond === false || res.headersSent) {
          return;
        }

        res.json({
          resultCode: 'OK',
          payload,
        });

        return;
      } catch (err) {
        next(err);
        return;
      }

      next();
    };
  };
};
