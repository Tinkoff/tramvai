import { createToken } from '@tinkoff/dippy';
import type { Options } from '@tinkoff/lru-cache-nano';

/**
 * @description
 * Function for creating a new cache
 *
 * *Note*: currently only memory cache with `@tinkoff/lru-cache-nano` is supported
 */
export const CREATE_CACHE_TOKEN = createToken<CacheFactory>('createCache');

/**
 * @description
 * Function that us called on force cache clean up in the app
 */
export const REGISTER_CLEAR_CACHE_TOKEN = createToken<(type: string) => void | Promise<void>>(
  'registerClearCache',
  { multi: true }
);

/**
 * @description
 * Force cleaning up all caches in the app
 */
export const CLEAR_CACHE_TOKEN = createToken<(type?: string) => Promise<void>>('clearCache');

export interface Cache<T = any> {
  get(key: string): T;
  set(key: string, value: T): void;
  has(key: string): boolean;
  clear(): void;
}

export type CacheType = 'memory';

export interface CacheOptionsByType<T> {
  memory: [Options<string, T>] | [];
}

export type CacheFactory = <T, Type extends CacheType = 'memory'>(
  type?: Type,
  ...args: CacheOptionsByType<T>[Type]
) => Cache<T>;
