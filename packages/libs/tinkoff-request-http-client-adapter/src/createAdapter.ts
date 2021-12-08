import type {
  HttpClient,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
} from '@tramvai/http-client';
import type { TinkoffRequestOptions } from './createTinkoffRequest';
import { createTinkoffRequest } from './createTinkoffRequest';
import { HttpClientAdapter } from './httpClientAdapter';

export function createAdapter(options: TinkoffRequestOptions): HttpClient {
  const {
    logger,
    name,
    disableCache,
    createCache,
    cacheTime,
    defaultTimeout,
    validator,
    errorValidator,
    errorModificator,
    agent,
    modifyRequest = (req: HttpClientRequest): HttpClientRequest => req,
    modifyResponse = (res: HttpClientResponse<any>): HttpClientResponse<any> => res,
    modifyError = (err: HttpClientError): HttpClientError => err,
    ...httpClientOptions
  } = options;

  const tinkoffRequest = createTinkoffRequest(options);

  const httpClientAdapter = new HttpClientAdapter({
    options: {
      modifyRequest,
      modifyResponse,
      modifyError,
      ...httpClientOptions,
    },
    tinkoffRequest,
  });

  return httpClientAdapter;
}
