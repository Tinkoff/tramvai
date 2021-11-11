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
  modifyRequest?: (req: HttpClientRequest) => HttpClientRequest;
  modifyResponse?: <P = any, R = P>(res: HttpClientResponse<P>) => HttpClientResponse<R>;
  modifyError?: (error: HttpClientError, req: HttpClientRequest) => HttpClientError;
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
  [key: string]: any;
};

export type HttpClientResponse<P = any> = {
  payload: P;
  status: number;
  headers: Record<string, any>;
};

export type HttpClientError = Error & {
  [key: string]: any;
};

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
