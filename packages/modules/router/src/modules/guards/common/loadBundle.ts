import type { NavigationGuard } from '@tinkoff/router';
import type {
  BUNDLE_MANAGER_TOKEN,
  ACTION_REGISTRY_TOKEN,
  LOGGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
} from '@tramvai/tokens-common';

export const loadBundle = ({
  bundleManager,
  logger,
  actionRegistry,
  responseManager,
  dispatcherContext,
}: {
  bundleManager: typeof BUNDLE_MANAGER_TOKEN;
  logger: typeof LOGGER_TOKEN;
  actionRegistry: typeof ACTION_REGISTRY_TOKEN;
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
  dispatcherContext: typeof DISPATCHER_CONTEXT_TOKEN;
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
      // если бандл не найдён, то всё ок мы должны вернуть 404 на сервере, а на клиенте просто загрузить новую страницу
      responseManager.setStatus(404);
      return false;
    }

    // Пытаемся загрузить и в случае инициализации на клиенте, т.к.
    // несмотря на наличие бандла в разметке, все равно мы должны дождаться
    // его загрузки перед рендером
    try {
      const { components, reducers } = await bundleManager.get(bundle, pageComponent);

      const component = components[pageComponent];

      // pageComponent should have required fields even if it is lazy,
      // thanks to `git log 9466cb32bfb71ba49144ef839d3d5bce246e213c -L90,103:packages/modules/common/src/bundleManager/bundleManager.ts`
      component?.reducers?.forEach((reducer) => dispatcherContext.getStore(reducer));

      reducers?.forEach((reducer) => dispatcherContext.getStore(reducer));
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
