import type { Cache } from '@tramvai/tokens-common';
import type { UserAgent } from '@tinkoff/user-agent';
import { parse } from '@tinkoff/user-agent';

export const parseUserAgentWithCache = (cache: Cache, userAgent: string): UserAgent => {
  if (cache.has(userAgent)) {
    return cache.get(userAgent);
  }

  const result = parse(userAgent);
  cache.set(userAgent, result);

  return result;
};
