import type { commandLineListTokens } from '@tramvai/core';
import type { ResponseManager } from '@tramvai/tokens-common';

export interface ResponseCacheOptions {
  ttl: number;
  maxSize: number;
  line?: keyof typeof commandLineListTokens;
}

export interface ResponseCacheEntry {
  updatedAt: number;
  headers: ReturnType<ResponseManager['getHeaders']>;
  status: ReturnType<ResponseManager['getStatus']>;
  body: Buffer;
}
