import uniq from '@tinkoff/utils/array/uniq';

import { isNotFoundError, isRedirectFoundError } from '@tinkoff/errors';
import type { ACTION_REGISTRY_TOKEN, ACTION_PAGE_RUNNER_TOKEN } from '@tramvai/tokens-common';

import type { ROUTER_TOKEN } from '@tramvai/tokens-router';

const stopRunAtError = (error: Error) => {
  if (isNotFoundError(error) || isRedirectFoundError(error)) {
    return true;
  }
};

export const runActionsFactory = ({
  router,
  actionRegistry,
  actionPageRunner,
}: {
  router: typeof ROUTER_TOKEN;
  actionRegistry: typeof ACTION_REGISTRY_TOKEN;
  actionPageRunner: typeof ACTION_PAGE_RUNNER_TOKEN;
}) => {
  return function runActions() {
    const route = router.getCurrentRoute();
    const { config: { bundle, pageComponent } = {} } = route;

    if (!bundle || !pageComponent) {
      throw new Error(`bundle and pageComponent should be defined, but got ${route}`);
    }

    const actions = uniq([
      ...(actionRegistry.getGlobal() || []),
      ...(actionRegistry.get(bundle) || []),
      ...(actionRegistry.get(pageComponent) || []),
    ]);

    return actionPageRunner.runActions(actions, stopRunAtError).catch((err) => {
      if (isRedirectFoundError(err)) {
        return router.navigate({
          url: err.nextUrl,
          replace: true,
          code: err.httpStatus,
        });
      }

      throw err.error || err;
    });
  };
};
