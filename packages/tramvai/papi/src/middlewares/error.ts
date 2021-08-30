import isNumber from '@tinkoff/utils/is/number';
import type { MiddlewareCreator } from '../types';

export interface Options {
  logger?: (
    name: string
  ) => {
    error: (data: any) => void;
  };
}

export const error = ({ logger }: Options = {}): MiddlewareCreator => {
  return (papi) => {
    const log = logger?.(papi.path);

    return (err, req, res, next) => {
      // Do nothing if respone already has been sent (i.e. timeout error)
      if (res.headersSent) {
        return;
      }

      log?.error({
        error: err,
        event: 'papiError',
        path: papi.path,
        method: papi.method,
      });

      res.status(isNumber(err.status) ? err.status : 500);

      // TODO: We need a general application-wide error factory which will let us to
      // decide what can be exposed in the response
      res.json({
        resultCode: 'INTERNAL_ERROR',
        errorMessage: 'internal error',
      });
    };
  };
};
