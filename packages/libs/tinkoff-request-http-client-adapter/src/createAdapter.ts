import type { HttpClient } from '@tramvai/http-client';
import type { TinkoffRequestOptions } from './createTinkoffRequest';
import { createTinkoffRequest } from './createTinkoffRequest';
import { HttpClientAdapter } from './httpClientAdapter';

export function createAdapter(options: TinkoffRequestOptions): HttpClient {
  const makeRequest = createTinkoffRequest(options);

  const httpClientAdapter = new HttpClientAdapter({ options, makeRequest });

  return httpClientAdapter;
}
