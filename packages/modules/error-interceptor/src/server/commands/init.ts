import type { LOGGER_TOKEN } from '@tramvai/module-common';
import { unhandledRejectionHandler, globalErrorHandler } from '@tinkoff/error-handlers';

export const initErrorInterceptorCommand = ({ logger }: { logger: typeof LOGGER_TOKEN }) => {
  const log = logger({
    name: 'error-interceptor',
  });
  return function initErrorInterceptor() {
    unhandledRejectionHandler(log);
    globalErrorHandler(log);
  };
};
