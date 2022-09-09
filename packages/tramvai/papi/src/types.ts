import type { IncomingHttpHeaders } from 'http';

import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { Url } from '@tinkoff/url';
import type { REQUEST_MANAGER_TOKEN, RESPONSE_MANAGER_TOKEN, Logger } from '@tramvai/tokens-common';
import type { PAPI_PARAMETERS } from './createPapiMethod';

export type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface Options {
  /**
   * Timeout in ms for handling request. If timeout is exceeded the response is resolved with 500 status.
   * **Note**: handler will still continues its execution possibly leading to heavy resource consumption
   *
   * @default 10000
   */
  timeout?: number;
}

export interface PapiHandlerOptions {
  headers: IncomingHttpHeaders;
  cookies: Record<string, string>;

  params: Record<string, string>;
  body: any;
  parsedUrl: Url;
  requestManager: typeof REQUEST_MANAGER_TOKEN;
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
}

export interface PapiHandlerContext<Deps> {
  log: Logger;
  deps: ProvideDepsIterator<Deps>;
}

export type NormalizedHandler<Result, Deps> = (
  this: PapiHandlerContext<Deps>,
  options: PapiHandlerOptions
) => Result;

export interface PapiParameters<Result, Deps> {
  path?: string;
  method?: Method;
  handler: NormalizedHandler<Result, Deps>;
  options?: Options;
  deps?: Deps;
}

export type NormalizedPapiParameters<Result, Deps> = Required<PapiParameters<Result, Deps>> & {
  handler: NormalizedHandler<Result, Deps>;
  options: Required<Options>;
};

export type Papi<Result = any, Deps = any> = NormalizedHandler<Deps, Result> & {
  [PAPI_PARAMETERS]: NormalizedPapiParameters<Deps, Result>;
};
