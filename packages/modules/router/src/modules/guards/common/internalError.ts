import type { NavigationGuard } from '@tinkoff/router';
import type { LOGGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';

export const internalError = ({
  responseManager,
  logger,
}: {
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
  logger: typeof LOGGER_TOKEN;
}): NavigationGuard => {
  const log = logger('route:guard-check-error');

  return async () => {
    if (responseManager.getStatus() >= 500) {
      log.error({
        event: 'status-is-error',
        status: responseManager.getStatus(),
      });

      return false;
    }
  };
};
