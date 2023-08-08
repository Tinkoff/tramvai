import LRU from '@tinkoff/lru-cache-nano';
import type { CacheFactory } from '@tramvai/tokens-common';

export const cacheFactory: CacheFactory = (type?, options = { max: 100 }) => {
  return new LRU(options);
};
