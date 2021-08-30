import connectTimeout from 'connect-timeout';
import type { MiddlewareCreator } from '../types';

export interface Options {
  timeout?: string;
}

declare module '../types' {
  export interface Options {
    timeout?: string;
  }
}

export const timeout = (options?: Options): MiddlewareCreator => {
  const defaultTimeout = options?.timeout ?? '10s';

  return (papi) => {
    const papiTimeout = papi.options.timeout || defaultTimeout;

    return connectTimeout(papiTimeout);
  };
};
