import { registerRoute, Route } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import type { ApplicationAssetsCacheOptions } from './types';
import { warmStrategyCache } from './warm-strategy-cache';
import { isApplicationAsset } from './routing';
import { createCacheKey } from './cache';

declare let self: ServiceWorkerGlobalScope;

/**
 * reference - https://github.com/GoogleChrome/workbox/blob/v7/packages/workbox-recipes/src/googleFontsCache.ts
 */
export function cacheApplicationFonts({
  precacheManifest = [],
  maxEntries = 30,
  maxAgeSeconds = 90 * 24 * 60 * 60,
  strategy: Strategy = StaleWhileRevalidate,
}: ApplicationAssetsCacheOptions = {}) {
  const strategy = new Strategy({
    cacheName: createCacheKey('fonts'),
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
    return isApplicationAsset(request) && request.destination === 'font';
  }, strategy);

  warmStrategyCache({ urls: precacheManifest, type: 'font', strategy });

  registerRoute(route);
}
