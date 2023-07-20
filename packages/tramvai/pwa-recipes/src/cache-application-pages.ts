import { registerRoute, Route } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import type { ApplicationAssetsCacheOptions } from './types';
import { warmStrategyCache } from './warm-strategy-cache';
import { isApplicationScope } from './routing';
import { createCacheKey } from './cache';

declare let self: ServiceWorkerGlobalScope;

/**
 * reference - https://github.com/GoogleChrome/workbox/blob/v7/packages/workbox-recipes/src/pageCache.ts
 */
export function cacheApplicationPages({
  precacheManifest = [],
  maxEntries = 30,
  maxAgeSeconds = 30 * 24 * 60 * 60,
  networkTimeoutSeconds = 3,
  strategy: Strategy = NetworkFirst,
}: ApplicationAssetsCacheOptions & { networkTimeoutSeconds?: number } = {}) {
  const strategy = new Strategy({
    cacheName: createCacheKey('pages'),
    networkTimeoutSeconds,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries,
        maxAgeSeconds,
        purgeOnQuotaError: true,
      }),
    ],
  });
  const route = new Route(({ request }) => {
    return isApplicationScope(request) && request.mode === 'navigate';
  }, strategy);

  warmStrategyCache({ urls: precacheManifest, type: 'html', strategy });

  registerRoute(route);
}
