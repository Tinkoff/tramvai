import find from '@tinkoff/utils/array/find';
import flatten from '@tinkoff/utils/array/flatten';
import type { DI_TOKEN } from '@tramvai/core';
import type { HttpClientRequest, HttpClientResponse } from '@tramvai/http-client';
import { BaseHttpClient } from '@tramvai/http-client';
import { createChildContainer } from '@tinkoff/dippy';
import { getPapiParameters } from '@tramvai/papi';
import { FASTIFY_REQUEST, FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';
import type { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { PAPI_EXECUTOR } from '@tramvai/tokens-server-private';

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

    const req = { headers: { host: 'localhost' }, cookies: {}, query, body };
    const res = {};

    const childDi = createChildContainer(this.di, [
      {
        provide: FASTIFY_REQUEST,
        useValue: req,
      },
      {
        provide: FASTIFY_RESPONSE,
        useValue: res,
      },
    ]);

    const papiExecutor = childDi.get(PAPI_EXECUTOR);

    const payload = await papiExecutor(papiRoute);

    return { payload, status: 200, headers: {} };
  }
}
