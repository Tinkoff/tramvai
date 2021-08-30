import prop from '@tinkoff/utils/object/prop';
import type { HttpClientResponse } from '@tramvai/http-client';
import { ApiService } from '@tramvai/http-client';
import type { Deps } from './papiService.h';

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
