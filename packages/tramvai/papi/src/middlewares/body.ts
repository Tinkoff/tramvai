import bodyParser from 'body-parser';
import type { MiddlewareCreator } from '../types';

export interface Options {
  limit?: string | number;
}

declare module '../types' {
  export interface Options {
    disableBodyCookie?: boolean;
  }
}

export const body = (options?: Options): MiddlewareCreator => {
  // PF-12590
  const limit = options?.limit ?? '2mb';

  return (papi) => {
    if (papi.options.disableBodyCookie) {
      return null;
    }

    return [
      bodyParser.text({ limit }),
      bodyParser.urlencoded({
        limit,
        extended: true,
      }),
      bodyParser.json({
        limit,
        type: ['application/json', 'application/csp-report'],
      }),
    ];
  };
};
