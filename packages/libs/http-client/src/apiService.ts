import type { HttpClientRequest, HttpClientResponse, HttpClient } from './httpClient';
import { BaseHttpClient } from './httpClient';

export class ApiService<
  Request extends HttpClientRequest = HttpClientRequest
> extends BaseHttpClient<Request> {
  constructor(public readonly httpClient: HttpClient) {
    super();
  }

  request<R = any>(request: Request): Promise<HttpClientResponse<R>> {
    return this.httpClient.request(request);
  }
}
