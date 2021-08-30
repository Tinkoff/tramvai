import type { Request, Response } from 'express';
import type { MockRepository } from './repositories/repository.h';

export interface Logger {
  debug: Function;
}

export interface ApiConfig {
  target: string;
}

export interface MockerOptions {
  logger: Logger;

  repositories: MockRepository[];

  apis?: Record<string, ApiConfig>;
  appRoutePrefix?: string;
  apiRoutePrefix?: string;
  passUnhandledRequests?: boolean;
  // @todo implement dynamicQueries ignore when request and mock query are matching
  dynamicQueries?: Record<string, string>;
}

export interface MockHandler {
  // @todo add context parametr with fetch method
  (req: Request, res: Response): any;
}

export interface MockConfig {
  status?: number;
  headers?: Record<string, string>;
  payload: any;
  pass?: boolean;
  // @todo implement dynamicQueries ignore when request and mock query are matching
  dynamicQueries?: Record<string, string>;
}

export type Mock = MockHandler | MockConfig;
