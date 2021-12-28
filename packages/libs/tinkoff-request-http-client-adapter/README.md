# @tramvai/tinkoff-request-http-client-adapter

Interface implementation `HttpClient` from [@tramvai/http-client](references/libs/http-client.md) based on the library [@tinkoff/request](https://tinkoff.github.io/tinkoff-request/)

## API

### createAdapter

`createAdapter` - factory to create an HTTP client. It configures an instance of `@tinkoff/request` via `createTinkoffRequest`, and based on it creates an instance of `HttpClientAdapter`

```tsx
type createAdapter = (options: TinkoffRequestOptions) => HttpClient;
```

### TinkoffRequestOptions

```tsx
interface TinkoffRequestOptions extends HttpClientRequest {
  // tramvai logger
  logger?: typeof LOGGER_TOKEN;
  // namespace for the logger, the prefix `request.` will be added to it
  name?: string;
  // will disable the default caching via `@tinkoff/request-plugin-cache-memory`
  disableCache?: boolean;
  // cache factory for `@tinkoff/request-plugin-cache-memory`
  createCache?: (options: any) => any;
  // cache ttl for `@tinkoff/request-plugin-cache-memory`
  cacheTime?: number;
  // the default request execution time limit, in ms
  defaultTimeout?: number;
  // response validator for `@tinkoff/request-plugin-validate`
  validator?: RequestValidator;
  // error validator for `@tinkoff/request-plugin-validate`
  errorValidator?: RequestValidator;
  // method allows you to modify the error object before sending logs from `@tinkoff/request-plugin-log`
  errorModificator?: RequestValidator;
}
```

### createTinkoffRequest

`createTinkoffRequest` - creates an instance of `@tinkoff/request` with all the necessary plugins

```tsx
type createTinkoffRequest = (options: TinkoffRequestOptions) => MakeRequest;
```

### HttpClientAdapter

`HttpClientAdapter` - adapts `@tinkoff/request` to the interface `HttpClient`.

The `request` method wraps the request parameters in the `modifyRequest` option, and passes them to `@tinkoff/request`. Then, the received response is modified in the `HttpClientRequest`, and wrapped in the `modifyResponse` option. If there is an error, it will wrapped into the `modifyError` option.

The `fork` method creates a new instance of `HttpClientAdapter`, but with the same `@tinkoff/request` instance.

```tsx
type HttpClientAdapter = HttpClient;
```

### mergeOptions

By default, `mergeOptions` compose `modifyRequest`, `modifyResponse` and `modifyError` options, with the corresponding options from `options` being executed first, then from `nextOptions`. If you pass a third parameter `{ replace: true }`, all parameters of the same name from `options` will simply be overwritten by parameters from `nextOptions`

```tsx
type mergeOptions = (
  options: HttpClientRequest,
  nextOptions: HttpClientRequest,
  config?: { replace?: boolean }
) => HttpClientRequest;
```
