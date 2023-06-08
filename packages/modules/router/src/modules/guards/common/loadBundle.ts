import type { NavigationGuard } from '@tinkoff/router';
import type {
  BUNDLE_MANAGER_TOKEN,
  LOGGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import type { PAGE_REGISTRY_TOKEN } from '@tramvai/tokens-router';

export const loadBundle = ({
  bundleManager,
  logger,
  responseManager,
  pageRegistry,
}: {
  bundleManager: typeof BUNDLE_MANAGER_TOKEN;
  logger: typeof LOGGER_TOKEN;
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
  pageRegistry: typeof PAGE_REGISTRY_TOKEN;
}): NavigationGuard => {
  const log = logger('route:load-bundles');

  return async ({ to }) => {
    log.debug({
      event: 'load-bundle',
      route: to,
    });

    const { bundle, pageComponent } = to.config;

    if (!bundleManager.has(bundle, pageComponent)) {
      log.info({
        event: 'load-bundle-not-found',
        bundle,
        pageComponent,
      });
      responseManager.setStatus(404);
      return false;
    }

    try {
      await pageRegistry.resolve(to);
    } catch (error) {
      log.error({
        event: 'load-bundle-failed',
        error,
      });

      // блокируем переход если не удалось загрузить бандл
      return false;
    }
  };
};
