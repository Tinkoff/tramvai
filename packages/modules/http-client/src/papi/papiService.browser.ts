import prop from '@tinkoff/utils/object/prop';
import { ApiService } from '@tramvai/http-client';
import type { HttpClientResponse } from '@tramvai/http-client';
import type { HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import type { SERVER_MODULE_PAPI_PUBLIC_URL } from '@tramvai/tokens-server';

interface Deps {
  httpClientFactory: typeof HTTP_CLIENT_FACTORY;
  baseUrl: typeof SERVER_MODULE_PAPI_PUBLIC_URL;
}

export class PapiService extends ApiService {
  constructor({ httpClientFactory, baseUrl }: Deps) {
    const httpClient = httpClientFactory({
      name: 'papi',
      baseUrl,
      validator: ({ response }: { response: Record<string, any> }) => {
        if (response.resultCode && response.payload) {
          return;
        }
        return response.error || new Error(JSON.stringify(response));
      },
      modifyResponse(response: HttpClientResponse): HttpClientResponse['payload'] {
        return {
          ...response,
          payload: prop('payload', response.payload),
        };
      },
    });

    super(httpClient);
  }
}
