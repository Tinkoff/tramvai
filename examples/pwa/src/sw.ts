/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

const manifest = self.__WB_MANIFEST;

console.error('manifest', manifest);

precacheAndRoute(
  manifest.filter((item) => {
    if ((typeof item === 'string' ? item : item.url).match(/\.png$/)) {
      return false;
    }
    return true;
  })
);

clientsClaim();
self.skipWaiting();
