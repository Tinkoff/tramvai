# @tramvai/module-http-client

The module provides the application with a factory of HTTP clients, a basic service for working with various APIs and a service for working with `papi`.

## Installation

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

## Features

The `http-client` module adds functionality to the application related to API requests. Available providers allow you to create new services to work with any API and create more specific services with preset settings for specific APIs.

The module implements interfaces from the library [@tramvai/http-client](references/libs/http-client.md) using a special library - adapter [@tramvai/tinkoff-request-http-client-adapter](references/libs/tinkoff-request-http-client-adapter.md), running on top of [@tinkoff/request](https://tinkoff.github.io/tinkoff-request/).

## Concepts

### HTTP client

HTTP client - implementation of the `HttpClient` interface, created via the `HTTP_CLIENT_FACTORY` token. HTTP client accepts general settings, some of which will be used as defult values ​​for all requests. The HTTP client does not provide an opportunity to add additional methods for requests, and to perform side actions when the request is completed or failed.

### Services for working with API

The API service inherits from the `ApiService` class, which is exported from `@tramvai/http-client`. The API service takes an HTTP client in its constructor and uses it for requests. The API service implements all methods for requests from the `HttpClient` interface, but allows you to modify them. For example, you can replace the implementation of the `request` method by adding an error message to the `catch` request via an HTTP client - this logic will automatically work for all other methods - `get`, `put`, `post`, `delete`. In the API service, you can add custom methods for requests to certain API endpoints, and specify only the necessary parameters in them, and type responses.

Additional reasons to create API services - if you need to use several different HTTP clients to work with a specific API, or you need the ability to add a convenient abstraction on top of the basic methods for sending requests.

## Usage

### Create a new HTTP client

Each new HTTP client must directly or indirectly inherit `HTTP_CLIENT_FACTORY`.

New HTTP clients / API services should not be created with `scope: Scope.SINGLETON`, because each request is supplemented with default parameters specific to each user, for example - passing the `X-Real-Ip` header from the request to the application in all requests to the API.

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
import { createAction } from '@tramvai/core';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

export const fetchAction = createAction({
  name: 'fetch',
  fn: async (_, __, { httpClient }) => {
    const { payload, headers, status } = await httpClient.get(
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
NODE_DEBUG=request tramvai start<appName>
```

## Exported tokens

[link](references/tokens/http-client-tokens.md)

## Environment Variables

- `HTTP_CLIENT_CACHE_DISABLED` - disable caching for all HTTP clients
- `HTTP_CLIENT_CIRCUIT_BREAKER_DISABLED` - disable plugin https://tinkoff.github.io/tinkoff-request/docs/plugins/circuit-breaker.html
