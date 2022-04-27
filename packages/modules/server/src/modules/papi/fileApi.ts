import eachObj from '@tinkoff/utils/object/each';

import type { Provider } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { createPapiMethod, getPapiParameters } from '@tramvai/papi';
// eslint-disable-next-line no-restricted-imports
import type { Papi, PapiParameters } from '@tramvai/papi/lib/types';
import type ApiType from '@tramvai/cli/lib/external/api';

let Api: typeof ApiType;
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

const getFileApi = ({ logger }: { logger: typeof LOGGER_TOKEN }) => {
  const log = logger('papi:fileApi');
  const result: Papi[] = [];

  eachObj((v, k) => {
    const handler: Papi = (v.handler || v.default) as any;

    if (!handler) {
      log.error({
        message: `Cannot resolve a papi handler.
Check that you are using file based papi right way by docs https://tramvai.dev/docs/how-to/how-create-papi#automatic-handler-creation
In case you have not added any file papi handler, consider renaming directory ./src/api (by default) to the other name to resolve conflicts with papi, or
change settings application.commands.build.options.serverApiDir in tramvai.json`,
      });

      throw new Error('Not a papi');
    }

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
  useFactory: getFileApi,
  deps: {
    logger: LOGGER_TOKEN,
  },
};
