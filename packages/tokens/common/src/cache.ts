import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Функция для создания кеша
 */
export const CREATE_CACHE_TOKEN = createToken<CacheFactory>('createCache');

/**
 * @description
 * Функция для вызова очистки кешей
 */
export const REGISTER_CLEAR_CACHE_TOKEN = createToken<(type: string) => void | Promise<void>>(
  'registerClearCache',
  { multi: true }
);

/**
 * @description
 * Можно задать в своем модуле, как функцию которая должна вызываться при вызове `CLEAR_CACHE_TOKEN`
 */
export const CLEAR_CACHE_TOKEN = createToken<(type?: string) => Promise<void>>('clearCache');

export interface Cache<T = any> {
  get(key: string): T;
  set(key: string, value: T): void;
  has(key: string): boolean;
  clear(): void;
}

export type CacheFactory = <T>(type?: string, ...args: unknown[]) => Cache<T>;
