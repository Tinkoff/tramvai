import eachObj from '@tinkoff/utils/object/each';

import type { Provider } from '@tramvai/core';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { createPapiMethod, getPapiParameters } from '@tramvai/papi';
// eslint-disable-next-line no-restricted-imports
import type { Papi, PapiParameters } from '@tramvai/papi/lib/types';

interface ApiHandler extends PapiParameters<any, any> {
  default?: Papi | Function;
  rootDeps?: Record<string, any>;
  mapRootDeps?: (deps: Record<string, any>) => any;
}
let Api: Record<string, ApiHandler>;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  Api = require('@tramvai/cli/lib/external/api').default; // eslint-disable-line import/no-unresolved
} catch (e) {}

declare module '@tramvai/papi/lib/types' {
  export interface PapiParameters<Deps, Result> {
    rootDeps?: Record<string, any>;
    mapRootDeps?: (rootDeps: Record<string, any>) => Record<string, any>;
  }
}

const getFileApi = () => {
  const result: Papi[] = [];

  eachObj((v, k) => {
    const handler: Papi = (v.handler || v.default) as any;
    const papiParameters = getPapiParameters(handler);

    result.push(
      createPapiMethod({
        ...v,
        ...(papiParameters ?? {}),
        path: `/${k}`,
        handler,
      })
    );
  }, Api);

  return result;
};

export const fileApiProvider: Provider = {
  provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
  multi: true,
  useValue: getFileApi(),
};
