import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Function for creating a new cache
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

export type CacheFactory = <T>(type?: string, ...args: unknown[]) => Cache<T>;
