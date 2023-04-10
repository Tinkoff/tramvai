export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'head'
  | 'patch'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'HEAD'
  | 'PATCH';

export type RequestContentType = 'form' | 'json' | 'xml' | 'urlencoded';

export type ResponseContentType = 'json' | 'blob' | 'text' | 'buffer' | 'arrayBuffer';

export interface HttpClientBaseOptions extends HttpClientRequest {
  /**
   * @deprecated use interceptors instead
   */
  modifyRequest?: (req: HttpClientRequest) => HttpClientRequest;
  /**
   * @deprecated use interceptors instead
   */
  modifyResponse?: <P = any, R = P>(res: HttpClientResponse<P>) => HttpClientResponse<R>;
  /**
   * @deprecated use interceptors instead
   */
  modifyError?: (error: HttpClientError, req: HttpClientRequest) => HttpClientError;
  interceptors?: HttpClientInterceptor[];
}

export type HttpClientRequest = {
  url?: string;
  path?: string;
  baseUrl?: string;
  method?: HttpMethod;
  requestType?: RequestContentType;
  responseType?: ResponseContentType;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  timeout?: number;
  silent?: boolean;
  cache?: boolean;
  abortPromise?: Promise<void>;
  signal?: AbortSignal;
  [key: string]: any;
};

export type HttpClientResponse<P = any> = {
  payload: P;
  status: number;
  headers: Record<string, any>;
};

export type HttpClientError = Error & {
  status?: number;
  headers?: Record<string, any>;
  [key: string]: any;
};

export type HttpClientInterceptor = (
  request: HttpClientRequest,
  next: HttpClient['request']
) => Promise<HttpClientResponse>;

export type HttpClient = {
  fork(options?: HttpClientBaseOptions, mergeOptionsConfig?: { replace?: boolean }): HttpClient;
  request<P = any>(request: HttpClientRequest): Promise<HttpClientResponse<P>>;
  get<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  post<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  put<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  delete<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
};

export abstract class BaseHttpClient<Request extends HttpClientRequest = HttpClientRequest> {
  abstract request<R = any>(request: Request): Promise<HttpClientResponse<R>>;

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
