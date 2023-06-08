import { createToken, optional, provide } from '@tramvai/core';
import type { Route } from '@tinkoff/router';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import {
  ROUTER_TOKEN,
  ROUTE_RESOLVE_TOKEN,
  LINK_PREFETCH_MANAGER_TOKEN,
  LINK_PREFETCH_HANDLER_TOKEN,
  PAGE_REGISTRY_TOKEN,
} from '@tramvai/tokens-router';
import { parse } from '@tinkoff/url';
import { scheduling } from '@tramvai/state';
import { routeTransformToken } from '../../tokens';

const PREFETCHED_LINKS_CACHE_TOKEN = createToken<Set<string>>();
const PREFETCHED_LINKS_QUEUE_TOKEN = createToken<{
  add(run: () => Promise<void>): Promise<void>;
}>();

export const prefetchProviders = [
  provide({
    provide: PREFETCHED_LINKS_CACHE_TOKEN,
    useValue: new Set<string>(),
  }),
  provide({
    provide: PREFETCHED_LINKS_QUEUE_TOKEN,
    useFactory: () => {
      const schedule = scheduling();
      let queue = Promise.resolve();

      return {
        add(run: () => Promise<void>): Promise<void> {
          queue = queue.then(() => {
            return new Promise((resolve, reject) => {
              // break microtask queue
              schedule(() => {
                // eslint-disable-next-line promise/no-nesting
                run().then(resolve).catch(reject);
              });
            });
          });

          return queue;
        },
      };
    },
  }),
  provide({
    provide: LINK_PREFETCH_MANAGER_TOKEN,
    useFactory: ({
      router,
      routeTransform,
      routeResolve,
      logger,
      prefetchedLinksCache,
      prefetchedLinksQueue,
      pageRegistry,
      prefetchHandlers,
    }) => {
      const log = logger('link-prefetch-manager');

      const prefetch = async (url: string) => {
        // prefetch needed for cache assets by browser, so we want to prefetch resources for any page only once.
        // cache will work only for SPA-router, but anyway resources loading deduplication logic already included in @loadable
        if (prefetchedLinksCache.has(url)) {
          return;
        }

        prefetchedLinksCache.add(url);

        log.info({ event: 'prefetch-route-init', url });

        // first, try to find static or resolved dynamic route
        let route: Route | void = router.resolve(url);

        // if route not found, try to resolve dynamic route,
        // logic from `ROUTER_TOKEN` provider factory, without `router.addRoute` method call
        if (!route && routeResolve) {
          const parsedUrl = parse(url);

          route = await routeResolve({
            url: parsedUrl,
            type: 'navigate',
          });

          if (route) {
            route = routeTransform(route);
            // warmup route for possible navigation
            router.addRoute(route);
          }
        }

        if (!route) {
          log.info({ event: 'prefetch-route-not-found', url });
          return;
        }

        // @todo: очередь запросов!
        try {
          await pageRegistry.resolve(route);

          await Promise.all(prefetchHandlers.map((handler) => handler(route as Route)));

          log.info({ event: 'prefetch-route-success', url });
        } catch (error) {
          log.warn({
            event: 'prefetch-fail',
            url,
            error,
          });
        }
      };

      return {
        prefetch: (url: string) => {
          // fetch assets sequentially
          return prefetchedLinksQueue.add(() => prefetch(url));
        },
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      routeTransform: routeTransformToken,
      routeResolve: optional(ROUTE_RESOLVE_TOKEN),
      logger: LOGGER_TOKEN,
      prefetchedLinksCache: PREFETCHED_LINKS_CACHE_TOKEN,
      prefetchedLinksQueue: PREFETCHED_LINKS_QUEUE_TOKEN,
      pageRegistry: PAGE_REGISTRY_TOKEN,
      prefetchHandlers: optional(LINK_PREFETCH_HANDLER_TOKEN),
    },
  }),
];
