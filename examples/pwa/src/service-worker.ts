/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import {
  cacheApplicationImages,
  cacheApplicationStaticAssets,
  cacheApplicationFonts,
  cacheApplicationPages,
} from '@tramvai/pwa-recipes';

declare const self: ServiceWorkerGlobalScope;

const SW_VERSION = '1.0.0';

self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }
});

const precacheManifest = self.__WB_MANIFEST;

console.error('[sw] precacheManifest', precacheManifest);

// @todo integration tests
cacheApplicationStaticAssets({ precacheManifest });
cacheApplicationImages({ precacheManifest });
cacheApplicationFonts({ precacheManifest });
cacheApplicationPages({ precacheManifest, networkTimeoutSeconds: 1 });

// @todo
// cacheApplicationAdminRoutes();
// cacheApplicationCSRFallback();

// https://web.dev/service-worker-lifecycle/#skip-the-waiting-phase
self.addEventListener('install', () => {
  self.skipWaiting();
});

// https://web.dev/service-worker-lifecycle/#clientsclaim
clientsClaim();
