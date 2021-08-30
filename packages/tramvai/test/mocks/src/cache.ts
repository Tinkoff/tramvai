import type { Cache } from '@tramvai/tokens-common';

export const createMockCache = <T = any>(entries: Record<string, T> = {}): Cache => {
  let cache = { ...entries };
  return {
    has: (key: string) => !!cache[key],
    get: (key: string) => cache[key],
    set: (key: string, value: T) => {
      cache[key] = value;
    },
    clear: () => {
      cache = {};
    },
    // TODO: в @tinkoff/request- используются методы из lru-cache которых нету в Cache
    // @ts-ignore
    peek: (key: string) => cache[key],
  };
};
