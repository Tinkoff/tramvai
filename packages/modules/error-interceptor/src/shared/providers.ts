import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { ERROR_BOUNDARY_TOKEN } from '@tramvai/react';

export const sharedProviders: Provider[] = [
  provide({
    provide: ERROR_BOUNDARY_TOKEN,
    useFactory: ({ logger }) => {
      const log = logger('error-interceptor:error-boundary');

      return function logErrorBoundary(error, info) {
        log.error({
          event: 'component-did-catch',
          error,
          info,
        });
      };
    },
    deps: {
      logger: LOGGER_TOKEN,
    },
    multi: true,
  }),
];
