import type { Route } from '@tinkoff/router';
import type { Provider } from '@tramvai/core';
import { commandLineListTokens, provide } from '@tramvai/core';
import { resolveLazyComponent } from '@tramvai/react';
import { CHILD_APP_PRELOAD_MANAGER_TOKEN } from '@tramvai/tokens-child-app';
import { LINK_PREFETCH_HANDLER_TOKEN, PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

const pagePreload = async (
  {
    pageService,
    preloadManager,
  }: {
    pageService: typeof PAGE_SERVICE_TOKEN;
    preloadManager: typeof CHILD_APP_PRELOAD_MANAGER_TOKEN;
  },
  route?: Route
): Promise<void> => {
  const components = await Promise.all([
    resolveLazyComponent(pageService.resolveComponentFromConfig('layout', route)),
    resolveLazyComponent(pageService.resolveComponentFromConfig('nestedLayout', route)),
    resolveLazyComponent(pageService.resolveComponentFromConfig('page', route)),
  ]);

  await Promise.all(
    components.map(async (component) => {
      if (component?.childApps) {
        await Promise.all(
          component.childApps.map((request) =>
            preloadManager.preload(request).catch(() => {
              // actual error will be logged internally
            })
          )
        );
      }
    })
  );
};

export const pagePreloadProviders: Provider[] = [
  provide({
    provide: LINK_PREFETCH_HANDLER_TOKEN,
    useFactory: (deps) => {
      return function prefetchChildApps(route) {
        return pagePreload(deps, route);
      };
    },
    multi: true,
    deps: {
      pageService: PAGE_SERVICE_TOKEN,
      preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: commandLineListTokens.resolvePageDeps,
    useFactory: (deps) => {
      let isSpaNavigation = false;
      return function preloadChildApps() {
        const promise = pagePreload(deps);

        if (!isSpaNavigation) {
          isSpaNavigation = true;
          return promise;
        }
      };
    },
    multi: true,
    deps: {
      pageService: PAGE_SERVICE_TOKEN,
      preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
    },
  }),
];
