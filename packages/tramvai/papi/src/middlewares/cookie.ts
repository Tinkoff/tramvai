import cookieParser from 'cookie-parser';
import type { MiddlewareCreator } from '../types';

declare module '../types' {
  export interface Options {
    disableBodyCookie?: boolean;
  }
}

export const cookie = (): MiddlewareCreator => {
  return (papi) => {
    if (papi.options.disableBodyCookie) {
      return null;
    }

    return cookieParser();
  };
};
