/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

const SW_VERSION = '1.0.0';

self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }
});

precacheAndRoute(self.__WB_MANIFEST);

// https://web.dev/service-worker-lifecycle/#skip-the-waiting-phase
self.addEventListener('install', () => {
  self.skipWaiting();
});

// https://web.dev/service-worker-lifecycle/#clientsclaim
clientsClaim();
