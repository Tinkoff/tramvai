---
id: http-client
title: HTTP Client
---

## Explanation

The [@tramvai/module-http-client](references/modules/http-client.md) module adds functionality to the application related to API requests. Available providers allow you to create new services to work with any API and create more specific services with preset settings for specific APIs.

[@tinkoff/request](https://tinkoff.github.io/tinkoff-request/) library is used under the hood, and provides a lot of important functionality:
- [logging](https://tinkoff.github.io/tinkoff-request/docs/plugins/log.html)
- [caching](https://tinkoff.github.io/tinkoff-request/docs/plugins/cache-memory.html)
- [requests deduplication](https://tinkoff.github.io/tinkoff-request/docs/plugins/cache-deduplicate.html)
- [Circuit Breaker](https://tinkoff.github.io/tinkoff-request/docs/plugins/circuit-breaker.html)

## Concepts

### HTTP client

HTTP client - implementation of the `HttpClient` interface, created via the `HTTP_CLIENT_FACTORY` token. HTTP client accepts general settings, some of which will be used as defult values ​​for all requests. The HTTP client does not provide an opportunity to add additional methods for requests, and to perform side actions when the request is completed or failed.

### Services for working with API

The API service inherits from the `ApiService` class, which is exported from `@tramvai/http-client`. The API service takes an HTTP client in its constructor and uses it for requests. The API service implements all methods for requests from the `HttpClient` interface, but allows you to modify them. For example, you can replace the implementation of the `request` method by adding an error message to the `catch` request via an HTTP client - this logic will automatically work for all other methods - `get`, `put`, `post`, `delete`. In the API service, you can add custom methods for requests to certain API endpoints, and specify only the necessary parameters in them, and type responses.

Additional reasons to create API services - if you need to use several different HTTP clients to work with a specific API, or you need the ability to add a convenient abstraction on top of the basic methods for sending requests.


## Usage

### Installation

You need to install `@tramvai/module-http-client`

```bash
yarn add @tramvai/module-http-client
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { HttpClientModule } from '@tramvai/module-http-client';

createApp({
  name: 'tincoin',
  modules: [HttpClientModule],
});
```

### Create a new HTTP client

Each new HTTP client must directly or indirectly inherit `HTTP_CLIENT_FACTORY`.

:::caution

New HTTP clients / API services should not be created with `scope: Scope.SINGLETON`, because each request is supplemented with default parameters specific to each user, for example - passing the `X-Real-Ip` header from the request to the application in all requests to the API.

:::

#### Basic HTTP client

The `HTTP_CLIENT_FACTORY` token - provides a factory for creating new HTTP clients. The options are preinstalled with a logger and a cache factory.

##### Peculiarities

- For all requests to the API, headers are added from the list returned by the `API_CLIENT_PASS_HEADERS` token, and `X-Real-Ip` from the current request to the application

**Token interface:**

```tsx
type HTTP_CLIENT_FACTORY = (options: HttpClientFactoryOptions) => HttpClient;
```

**Token use:**

```tsx
import { Scope, provide } from '@tramvai/core';
import { ENV_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';

const provider = provide({
  provide: 'WHATEVER_API_HTTP_CLIENT',
  useFactory: ({
    factory,
    envManager,
  }: {
    factory: typeof HTTP_CLIENT_FACTORY;
    envManager: typeof ENV_MANAGER_TOKEN;
  }) => {
    return factory({
      name: 'whatever-api',
      baseUrl: envManager.get('WHATEVER_API'),
    });
  },
  deps: {
    factory: HTTP_CLIENT_FACTORY,
    envManager: ENV_MANAGER_TOKEN,
  },
});
```

### Using existing HTTP clients

Most HTTP clients implement additional logic for requests, and inherit from `ApiService`. Thus, each service has methods `get`, `post`, `put`, `delete` and `request`, but there may be specific methods.

#### Common HTTP client

The `HTTP_CLIENT` token provides a basic client for sending requests to any URLs, request caching is disabled.

**Token use:**

```tsx
import { declareAction } from '@tramvai/core';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

export const fetchAction = declareAction({
  name: 'fetch',
  async fn() {
    const { payload, headers, status } = await this.deps.httpClient.get(
      'https://www.domain.com/api/endpoint'
    );
    return payload;
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});
```

### Adding custom data to requests

Let's consider a case using the abstract service `WHATEVER_API_SERVICE` as an example. Let's say we want to add an `X-Real-Ip` header to every request:

```tsx
import { provide } from '@tramvai/core';
import { HttpClientRequest, HttpClient } from '@tramvai/http-client';
import { REQUEST_MANAGER_TOKEN } from '@tramvai/tokens-common';

const provider = provide({
  provide: 'WHATEVER_API_SERVICE',
  useFactory: ({
    factory,
    requestManager,
    envManager,
  }: {
    factory: typeof HTTP_CLIENT_FACTORY;
    requestManager: typeof REQUEST_MANAGER_TOKEN;
    envManager: typeof ENV_MANAGER_TOKEN;
  }) => {
    return factory({
      name: 'whatever-api',
      baseUrl: envManager.get('WHATEVER_API'),
      modifyRequest: (request: HttpClientRequest) => {
        return {
          ...request,
          headers: {
            ...request.headers,
            'X-real-ip': requestManager.getClientIp(),
          },
        };
      },
    });
  },
  deps: {
    factory: HTTP_CLIENT_FACTORY,
    requestManager: REQUEST_MANAGER_TOKEN,
    envManager: ENV_MANAGER_TOKEN,
  },
});
```

## How to

### How to disable HTTP request caching?

To disable caching for all HTTP clients, pass the env variable `HTTP_CLIENT_CACHE_DISABLED: true` to the application

### Testing

#### Testing your api clients

If you have a module or providers that define api-clients, then it will be convenient to use special utilities in order to test them separately

```ts
import { testApi } from '@tramvai/module-http-client/tests';
import { CustomModule } from './module';

describe('testApi', () => {
  it('test', async () => {
    const { di, fetchMock, mockJsonResponse } = testApi({
      modules: [CustomModule],
      env: {
        TEST_API: 'testApi',
      },
    });
    const httpClient: typeof HTTP_CLIENT = di.get('CUSTOM_HTTP_CLIENT') as any;

    mockJsonResponse({ a: 'aaa' });

    const { payload } = await httpClient.get('test');

    expect(payload).toEqual({ a: 'aaa' });
    expect(fetchMock).toHaveBeenCalledWith('http://testApi/test', expect.anything());
  });
});
```

### Logging

By default, `@tinkoff/request` will log every failed requests with level `error`. You can disable logging by pass `{ silent: true }` parameter to request parameters. Useful meta information about request will be available in `error.__meta` property.

Example:

```ts
const log = logger('request:test');

httpClient.request({ path: 'test', silent: true }).catch((error) => {
  log.info(error);
});
```

### Debug

You can show all the default logs of http clients by providing these env variables:

```bash
LOG_ENABLE=request*
LOG_LEVEL=trace
```

If the built-in http clients logs are not enough, you can enable NodeJS debugging of the `request` module this way:

```bash
NODE_DEBUG=request tramvai start <appName>
```

## Environment Variables

- `HTTP_CLIENT_CACHE_DISABLED` - disable caching for all HTTP clients
- `HTTP_CLIENT_CIRCUIT_BREAKER_DISABLED` - disable plugin https://tinkoff.github.io/tinkoff-request/docs/plugins/circuit-breaker.html

##### - [Next: React Query](03-features/09-data-fetching/04-react-query.md)

## API Reference

You can find `HttpClient` and `ApiService` interfaces in [`@tramvai/http-client` package documentation](references/libs/http-client.md)

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
};
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
};
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
};
```

### HttpClientError

```tsx
type HttpClientError = Error & {
  // HTTP response code, only exists when request was finished
  status?: number;
  // HTTP response headers, only exists when request was finished
  headers?: Record<string, any>;
  [key: string]: any;
};
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

service.request({ path: 'fake' }); // show alert
service.get('fake'); // also show alert
```

##### - [Next: React Query](03-features/09-data-fetching/04-react-query.md)
