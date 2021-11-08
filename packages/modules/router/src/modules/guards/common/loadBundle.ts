import type { NavigationGuard } from '@tinkoff/router';
import type {
  BUNDLE_MANAGER_TOKEN,
  COMPONENT_REGISTRY_TOKEN,
  ACTION_REGISTRY_TOKEN,
  LOGGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';

export const loadBundle = ({
  bundleManager,
  logger,
  actionRegistry,
  componentRegistry,
  responseManager,
}: {
  bundleManager: typeof BUNDLE_MANAGER_TOKEN;
  logger: typeof LOGGER_TOKEN;
  actionRegistry: typeof ACTION_REGISTRY_TOKEN;
  componentRegistry: typeof COMPONENT_REGISTRY_TOKEN;
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
}): NavigationGuard => {
  const log = logger('route:load-bundles');

  return async ({ to }) => {
    log.debug({
      event: 'load-bundle',
      route: to,
    });

    const { bundle, pageComponent } = to.config;

    if (!bundleManager.has(bundle, pageComponent)) {
      // если бандл не найдён, то всё ок мы должны вернуть 404 на сервере, а на клиенте просто загрузить новую страницу
      responseManager.setStatus(404);
      return false;
    }

    // Пытаемся загрузить и в случае инициализации на клиенте, т.к.
    // несмотря на наличие бандла в разметке, все равно мы должны дождаться
    // его загрузки перед рендером
    try {
      await bundleManager.get(bundle, pageComponent);
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
