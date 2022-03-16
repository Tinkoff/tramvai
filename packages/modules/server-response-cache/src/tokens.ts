import { createToken } from '@tinkoff/dippy';
import type { Cache } from '@tramvai/tokens-common';
import type { ResponseCacheEntry, ResponseCacheOptions } from './types';

export const RESPONSE_CACHE_INSTANCE = createToken<Cache<ResponseCacheEntry>>(
  'server-response-cache instance'
);

export const RESPONSE_CACHE_SHOULD_USE_CACHE = createToken<() => boolean>(
  'server-response-cache should-use-cache'
);

export const RESPONSE_CACHE_GET_CACHE_KEY = createToken<() => string>(
  'server-response-cache get-cache-key'
);

export const RESPONSE_CACHE_SHOULD_SET_TO_CACHE = createToken<() => boolean>(
  'server-response-cache should-set-to-cache'
);

export const RESPONSE_CACHE_OPTIONS = createToken<ResponseCacheOptions>(
  'server-response-cache options'
);
