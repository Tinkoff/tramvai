import type { Papi } from '@tramvai/papi';
import { create, middlewares } from '@tramvai/papi';
import type express from 'express';
import type { DI_TOKEN } from '@tramvai/core';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { REQUEST, RESPONSE } from '@tramvai/tokens-common';
import { createChildContainer } from '@tinkoff/dippy';

export interface CreateOptions {
  di: typeof DI_TOKEN;
  logger: typeof LOGGER_TOKEN;
}

export function createApi(papiList: Papi[], { di, logger }: CreateOptions): express.RequestHandler {
  return create(papiList, [
    middlewares.timeout(),
    middlewares.body(),
    middlewares.cookie(),
    middlewares.validate(),
    middlewares.fillPapiState({
      fillState: (papi) => {
        let rootDeps = {};

        if (papi.rootDeps) {
          rootDeps = di.getOfDeps(papi.rootDeps);

          rootDeps = papi.mapRootDeps ? papi.mapRootDeps(rootDeps) : rootDeps;
        }

        return (req, res) => {
          const childDI = createChildContainer(di);

          childDI.register({
            provide: REQUEST,
            useValue: req,
          });
          childDI.register({
            provide: RESPONSE,
            useValue: res,
          });

          return { ...rootDeps, ...childDI.getOfDeps(papi.deps ?? {}), req, res };
        };
      },
    }),
    middlewares.handler(),
    middlewares.error({ logger }),
  ]);
}
