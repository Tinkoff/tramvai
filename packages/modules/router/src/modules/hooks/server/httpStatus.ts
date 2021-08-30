import type { NavigationHook } from '@tinkoff/router';
import type { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';

export const httpStatus = ({
  responseManager,
}: {
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
}): NavigationHook => async ({ to }) => {
  if (to?.config.httpStatus) {
    responseManager.setStatus(to.config.httpStatus);
  }
};
