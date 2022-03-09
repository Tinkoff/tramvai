import { createToken } from '@tinkoff/dippy';
import type { RequestLimiter, RequestLimiterOptions } from './requestLimiter';

export const REQUESTS_LIMITER_TOKEN = createToken<RequestLimiter>('requestsLimiterToken');

export const REQUESTS_LIMITER_ACTIVATE_TOKEN = createToken<boolean>('requestsLimiterActivateToken');

export const REQUESTS_LIMITER_OPTIONS_TOKEN = createToken<RequestLimiterOptions>(
  'requestsLimiterOptionsToken'
);
