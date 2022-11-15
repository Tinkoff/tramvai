import isArray from '@tinkoff/utils/is/array';
import type { NavigationGuard } from '@tinkoff/router';
import type { NestedLayoutComponent } from '@tramvai/react';
import { resolveLazyComponent } from '@tramvai/react';
import type {
  BUNDLE_MANAGER_TOKEN,
  ACTION_REGISTRY_TOKEN,
  LOGGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  DISPATCHER_TOKEN,
} from '@tramvai/tokens-common';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const loadBundle = ({
  bundleManager,
  logger,
  actionRegistry,
  responseManager,
  dispatcher,
  dispatcherContext,
  pageService,
}: {
  bundleManager: typeof BUNDLE_MANAGER_TOKEN;
  logger: typeof LOGGER_TOKEN;
  actionRegistry: typeof ACTION_REGISTRY_TOKEN;
  responseManager: typeof RESPONSE_MANAGER_TOKEN;
  dispatcher: typeof DISPATCHER_TOKEN;
  dispatcherContext: typeof DISPATCHER_CONTEXT_TOKEN;
  pageService: typeof PAGE_SERVICE_TOKEN;
}): NavigationGuard => {
  const log = logger('route:load-bundles');

  return async ({ to }) => {
    log.debug({
      event: 'load-bundle',
      route: to,
    });

    const { bundle, pageComponent, nestedLayoutComponent } = to.config;

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

      // @todo: reuse logic from bundleManager?
      // register nested layout actions and reducers for current page
      if (nestedLayoutComponent) {
        // @todo: different try/catch for safety?
        const layout = (await resolveLazyComponent(
          pageService.resolveComponentFromConfig('nestedLayout')
        )) as NestedLayoutComponent;

        if ('actions' in layout && isArray(layout.actions)) {
          actionRegistry.add(pageComponent, layout.actions);
        }

        if ('reducers' in layout && isArray(layout.reducers)) {
          layout.reducers.forEach((reducer) => {
            dispatcher.registerStore(reducer);
            dispatcherContext.getStore(reducer);
          });
        }
      }
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
