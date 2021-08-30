import type { RequestHandler, Request, Response } from 'express';
import type { MiddlewareCreator, PapiParameters } from '../types';

export interface Options {
  fillState: (papi: PapiParameters<any, any>) => (req: Request, res: Response) => any;
}

export const fillPapiState = ({ fillState }: Options): MiddlewareCreator => {
  return (papi): RequestHandler => {
    const fn = fillState(papi);

    return async (req, res, next) => {
      try {
        res.papiState = await fn(req, res);
      } catch (err) {
        next(err);
        return;
      }

      next();
    };
  };
};
