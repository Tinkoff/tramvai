import type { HttpClientRequest, HttpClientResponse, HttpClient } from './httpClient';

export abstract class ApiService<Request extends HttpClientRequest = HttpClientRequest> {
  constructor(public readonly httpClient: HttpClient) {}

  request<R = any>(request: Request): Promise<HttpClientResponse<R>> {
    return this.httpClient.request(request);
  }

  get<R = any>(
    path: string,
    payload?: Pick<Request, 'query' | 'headers'>,
    config?: Omit<Request, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request({
      path,
      ...payload,
      ...config,
      method: 'GET',
    } as Request);
  }

  post<R = any>(
    path: string,
    payload?: Pick<Request, 'query' | 'body' | 'headers'>,
    config?: Omit<Request, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request<R>({
      path,
      requestType: 'json',
      ...payload,
      ...config,
      method: 'POST',
    } as Request);
  }

  put<R = any>(
    path: string,
    payload?: Pick<Request, 'query' | 'body' | 'headers'>,
    config?: Omit<Request, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request<R>({
      path,
      requestType: 'json',
      ...payload,
      ...config,
      method: 'PUT',
    } as Request);
  }

  delete<R = any>(
    path: string,
    payload?: Pick<Request, 'query' | 'headers'>,
    config?: Omit<Request, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>> {
    return this.request<R>({
      path,
      ...payload,
      ...config,
      method: 'DELETE',
    } as Request);
  }
}
