import type { Cache } from '@tramvai/tokens-common';
import type { UserAgent } from '@tinkoff/user-agent';
import { parse } from '@tinkoff/user-agent';

export const parseUserAgentWithCache = (
  cache: Cache,
  userAgent: string,
  metrics: { hit: Function; miss: Function }
): UserAgent => {
  if (cache.has(userAgent)) {
    metrics.hit();
    return cache.get(userAgent);
  }

  metrics.miss();
  const result = parse(userAgent);
  cache.set(userAgent, result);

  return result;
};
