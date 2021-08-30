import type { RequestHandler, ErrorRequestHandler } from 'express';
import { Request, Response } from 'express';
import type { PAPI_PARAMETERS } from './createPapiMethod';

declare module 'express-serve-static-core' {
  export interface Response {
    papiState: Record<string, any>;
  }
}

export { Request, Response };

export type Handler = ErrorRequestHandler | RequestHandler;

export type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Middleware = Handler | Array<Handler> | null;

export interface Options {
  /**
   * Если включить эту опцию, свойство `request.url` не будет содержать путь текущего papi обработчика
   */
  trimPapiUrl?: boolean;
}

export type DepsWithDefaults<Deps> = Deps & { req: Request; res: Response };

export type NormalizedHandler<Deps, Result> = (deps: DepsWithDefaults<Deps>) => Result;

export interface PapiParameters<Deps, Result> {
  path: string;
  method?: Method;
  handler:
    | NormalizedHandler<Deps, Result>
    | ((req: Request, res: Response, deps: DepsWithDefaults<Deps>) => Result);
  options?: Options;
  deps?: Deps;
}

export type NormalizedPapiParameters<Deps, Result> = Required<PapiParameters<Deps, Result>> & {
  handler: NormalizedHandler<Deps, Result>;
};

export type Papi<Deps = any, Result = any> = NormalizedHandler<Deps, Result> & {
  [PAPI_PARAMETERS]: NormalizedPapiParameters<Deps, Result>;
};

export type MiddlewareCreator = (papi: NormalizedPapiParameters<any, any>) => Middleware;

export type Chain = Array<MiddlewareCreator>;
