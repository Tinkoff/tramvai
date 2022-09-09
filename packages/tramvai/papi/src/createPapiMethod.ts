import type { PapiParameters, Papi } from './types';

const DEFAULT_TIMEOUT = 10000;

export const PAPI_PARAMETERS = '__papi_parameters__';

export const createPapiMethod = <Result = any, Deps = any>(papi: PapiParameters<Result, Deps>) => {
  const result = Object.assign(papi.handler, {
    [PAPI_PARAMETERS]: {
      ...papi,
      options: {
        timeout: DEFAULT_TIMEOUT,
        ...papi.options,
      },
      method: papi.method || 'all',
    },
  }) as Papi;

  return result;
};

export const getPapiParameters = (papi: Papi<any, any>) => {
  return papi[PAPI_PARAMETERS];
};

export const isPapiMethod = (papi: any): papi is Papi => {
  return papi && !!getPapiParameters(papi);
};
