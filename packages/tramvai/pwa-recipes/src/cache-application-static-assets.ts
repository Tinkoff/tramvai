import { registerRoute, Route } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import type { ApplicationAssetsCacheOptions } from './types';
import { warmStrategyCache } from './warm-strategy-cache';
import { isApplicationAsset, isApplicationScope } from './routing';
import { createCacheKey } from './cache';

declare let self: ServiceWorkerGlobalScope;

/**
 * reference - https://github.com/GoogleChrome/workbox/blob/v7/packages/workbox-recipes/src/staticResourceCache.ts
 */
export function cacheApplicationStaticAssets({
  precacheManifest = [],
  maxEntries = 60,
  maxAgeSeconds,
  strategy: Strategy = StaleWhileRevalidate,
}: ApplicationAssetsCacheOptions = {}) {
  const strategy = new Strategy({
    cacheName: createCacheKey('static-assets'),
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries,
        maxAgeSeconds,
      }),
    ],
  });
  const route = new Route(({ request }) => {
    return (
      (isApplicationAsset(request) &&
        (request.destination === 'script' || request.destination === 'style')) ||
      (isApplicationScope(request) && request.destination === 'manifest')
    );
  }, strategy);

  warmStrategyCache({ urls: precacheManifest, type: ['script', 'style', 'manifest'], strategy });

  registerRoute(route);
}
