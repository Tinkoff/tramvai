# @tramvai/http-client

Абстрактный интерфейс `HttpClient` для стандартизации работы с внешними API в tramvai приложениях

## API

### HttpClient

```tsx
type HttpClient = {
  // common method for sending HTTP requests
  request<P = any>(request: HttpClientRequest): Promise<HttpClientResponse<P>>;
  // method for sending GET requests
  get<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // method for sending POST requests, uses `requestType: 'json'` by default
  post<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // method for sending PUT requests, uses `requestType: 'json'` by default
  put<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // method for sending DELETE requests
  delete<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // method for creating a new instance of the HTTP client, based on the settings of the current
  fork(options?: HttpClientRequest, mergeOptionsConfig?: { replace?: boolean }): HttpClient;
}
```

### HttpClientRequest

```tsx
type HttpClientRequest = {
  // absolute url of the request, do not use simultaneously with `path`
  url?: string;
  // url of the request, not to be used simultaneously with `url`
  path?: string;
  // base url, which is added to all queries before the `path` value
  baseUrl?: string;
  // basic HTTP methods are supported - GET, POST, PUT, DELETE
  method?: HttpMethod;
  // request data type, `form` by default
  requestType?: HttpContentType;
  // response data type, is calculated from the `content-type` header by default
  responseType?: HttpContentType;
  // HTTP request headers
  headers?: Record<string, any>;
  // request query parameters
  query?: Record<string, any>;
  // request body
  body?: Record<string, any>;
  // request execution time limit, in ms
  timeout?: number;
  // disabling logging inside the HTTP client. It is recommended to use if a request error is logged manually
  silent?: boolean;
  // disabling the request cache
  cache?: boolean;
  // if `abortPromise` is resolved, the request will be canceled
  abortPromise?: Promise<void>;
  // method to modify request data
  modifyRequest?: (req: HttpClientRequest) => HttpClientRequest;
  // method to modify response data
  modifyResponse?: <P = any>(res: HttpClientResponse<P>) => HttpClientResponse<P>;
  // method to modify the error object
  modifyError?: (error: HttpClientError, req: HttpClientRequest) => HttpClientError;
  [key: string]: any;
}
```

### HttpClientResponse

```tsx
type HttpClientResponse<P = any> = {
  // response body
  payload: P;
  // HTTP response code
  status: number;
  // HTTP response headers
  headers: Record<string, any>;
}
```

### HttpClientError

```tsx
type HttpClientError = Error & {
  [key: string]: any;
}
```

### ApiService

`ApiService` - abstract class for easy creation of services for working with API, allows you to override custom logic in the `request` method, on top of which the rest of the basic methods work.

For example, a service that automatically displays a pop-up window when a request error occurs:

```tsx
class CustomApiService extends ApiService {
  constructor({ httpClient }: { httpClient: HttpClient }) {
    super(httpClient);
  }

  request<R = any>(request: HttpClientRequest): Promise<HttpClientResponse<R>> {
    return this.httpClient.request(request).catch((error) => {
      alert(error);
    });
  }
}

const service = new CustomApiService({ httpClient });

service.request({ path: 'fake' }) // show alert
service.get('fake') // also show alert
```
