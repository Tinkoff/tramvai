import find from '@tinkoff/utils/array/find';
import flatten from '@tinkoff/utils/array/flatten';
import type { DI_TOKEN } from '@tramvai/core';
import type { HttpClientRequest, HttpClientResponse } from '@tramvai/http-client';
import { BaseHttpClient } from '@tramvai/http-client';
import { createChildContainer } from '@tinkoff/dippy';
import { getPapiParameters } from '@tramvai/papi';
import { REQUEST, RESPONSE } from '@tramvai/module-common';
import type { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';

export interface Deps {
  di: typeof DI_TOKEN;
  papi?: typeof SERVER_MODULE_PAPI_PUBLIC_ROUTE[];
}

export class PapiService extends BaseHttpClient {
  papi: Deps['papi'];
  di: Deps['di'];

  constructor({ papi, di }: Deps) {
    super();
    this.papi = flatten(papi || []);
    this.di = di;
  }

  async request<R = any>({ path, query, body }: HttpClientRequest): Promise<HttpClientResponse<R>> {
    const papiRoute = find((papi) => getPapiParameters(papi).path === `/${path}`, this.papi);

    if (!papiRoute) {
      throw new Error(`papi handler '${path}' not found`);
    }

    const papi = getPapiParameters(papiRoute);
    let rootDeps = {};

    if ((papi as any).rootDeps) {
      rootDeps = this.di.getOfDeps((papi as any).rootDeps);

      rootDeps = (papi as any).mapRootDeps ? (papi as any).mapRootDeps(rootDeps) : rootDeps;
    }

    const childDI = createChildContainer(this.di);
    const req = { headers: { host: 'localhost' }, cookies: {}, query, body };
    const res = {};

    childDI.register({
      provide: REQUEST,
      useValue: req as typeof REQUEST,
    });
    childDI.register({
      provide: RESPONSE,
      useValue: res as typeof RESPONSE,
    });

    const payload = await getPapiParameters(papiRoute).handler({
      ...rootDeps,
      ...childDI.getOfDeps(papi.deps ?? {}),
      req,
      res,
    });

    return { payload, status: 200, headers: {} };
  }
}
