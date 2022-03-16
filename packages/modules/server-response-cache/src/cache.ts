import type { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import type { ResponseCacheEntry } from './types';

export const getCacheEntry = (
  responseManager: typeof RESPONSE_MANAGER_TOKEN
): ResponseCacheEntry => {
  return {
    status: responseManager.getStatus(),
    headers: responseManager.getHeaders(),
    body: Buffer.from(responseManager.getBody(), 'utf-8'),
    updatedAt: Date.now(),
  };
};
