import type { Options } from 'lru-cache';
import LRU from 'lru-cache';
import type { Cache } from '@tramvai/tokens-common';

// @ts-ignore
LRU.prototype.clear = LRU.prototype.reset;

export const cacheFactory = (type?: string, ...args: Options<unknown, undefined>[]): Cache => {
  return new LRU(...args) as any;
};
