import type { PapiParameters, Papi } from './types';

export const PAPI_PARAMETERS = '__papi_parameters__';

export const createPapiMethod = <Deps = any, Result = any>(papi: PapiParameters<Deps, Result>) => {
  const handler =
    papi.handler.length > 1
      ? (deps: any) => {
          return papi.handler(deps?.req, deps?.res, deps);
        }
      : papi.handler;

  const result = Object.assign(handler, {
    [PAPI_PARAMETERS]: {
      ...papi,
      handler,
      options: papi.options || {},
      method: papi.method || 'all',
    },
  }) as Papi;

  return result;
};

export const getPapiParameters = <Deps = any, Result = any>(papi: Papi<Deps, Result>) => {
  return papi[PAPI_PARAMETERS];
};
