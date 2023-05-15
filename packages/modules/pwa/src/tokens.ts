import { createToken } from '@tinkoff/dippy';
import type { Workbox } from 'workbox-window';
import type { PwaMetaOptions } from '@tramvai/cli';

export type WebManifest = {
  [key: string]: any;
};

/**
 * @description Workbox instance
 */
export const PWA_WORKBOX_TOKEN = createToken<() => Promise<Workbox | null>>('pwa workbox');

/**
 * @description Token to owerwrite default - `pwa.sw.dest`
 */
export const PWA_SW_URL_TOKEN = createToken<string>('pwa sw url');

/**
 * @description Token to owerwrite default - `pwa.sw.scope`
 */
export const PWA_SW_SCOPE_TOKEN = createToken<string>('pwa sw scope');

/**
 * @description Token to owerwrite default - `${pwa.webmanifest.path}manifest.${pwa.webmanifest.ext}`
 */
export const PWA_MANIFEST_URL_TOKEN = createToken<string>('pwa manifest url');

/**
 * @description Token to owerwrite default - `pwa.meta` (meta tags will be added to all pages)
 */
export const PWA_META_TOKEN = createToken<PwaMetaOptions>('pwa meta');
