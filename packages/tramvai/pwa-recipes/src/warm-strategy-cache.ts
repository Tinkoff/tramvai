import type { ResourcesTypes, WarmStrategyCacheOptions } from './types';

declare let self: ServiceWorkerGlobalScope;

/**
 * reference - https://github.com/GoogleChrome/workbox/blob/v7/packages/workbox-recipes/src/warmStrategyCache.ts
 */
export function warmStrategyCache(options: WarmStrategyCacheOptions): void {
  self.addEventListener('install', (event) => {
    const done = options.urls
      .map((path) => {
        return typeof path === 'object' ? path.url : path;
      })
      .filter((path) => {
        const types = Array.isArray(options.type) ? options.type : [options.type];

        return types.some((type) => matchResourceType(type, path));
      })
      .map(
        (path) =>
          options.strategy.handleAll({
            event,
            request: new Request(path),
          })[1]
      );

    event.waitUntil(Promise.all(done));
  });
}

export function matchResourceType(type: ResourcesTypes, path: string): boolean {
  if (path.includes('?')) {
    // eslint-disable-next-line no-param-reassign
    [path] = path.split('?');
  }

  switch (type) {
    case 'script':
      return path.endsWith('.js');
    case 'style':
      return path.endsWith('.css');
    case 'manifest':
      return path.endsWith('.webmanifest') || path.endsWith('.json');
    case 'image':
      return (
        path.endsWith('.png') ||
        path.endsWith('.jpg') ||
        path.endsWith('.jpeg') ||
        path.endsWith('.svg') ||
        path.endsWith('.webp') ||
        path.endsWith('.avif')
      );
    case 'font':
      return (
        path.endsWith('.woff') ||
        path.endsWith('.woff2') ||
        path.endsWith('.ttf') ||
        path.endsWith('.otf')
      );
    case 'html':
      return (
        (path.startsWith(process.env.TRAMVAI_PWA_SW_SCOPE!) &&
          !matchResourceType('manifest', path)) ||
        path.endsWith('.html')
      );
    default:
      return false;
  }
}
