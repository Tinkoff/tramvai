# @tramvai/tinkoff-request-http-client-adapter

Реализация интерфейса `HttpClient` из [@tramvai/http-client](references/libs/http-client.md) на основе библиотеки [@tinkoff/request](https://tinkoffcreditsystems.github.io/tinkoff-request/)

## API

### createAdapter

`createAdapter` - фабрика для создания HTTP клиента, конфигурирует экземпляр `@tinkoff/request` через `createTinkoffRequest`, и на его основе создает экземпляр `HttpClientAdapter`

```tsx
type createAdapter = (options: TinkoffRequestOptions) => HttpClient;
```

### TinkoffRequestOptions

```tsx
interface TinkoffRequestOptions extends HttpClientRequest {
  // трамвай логгер
  logger?: typeof LOGGER_TOKEN;
  // неймспейс для логгера, к нему будет добавлен префикс `request.`
  name?: string;
  // отключет кэширование по умолчанию через `@tinkoff/request-plugin-cache-memory`
  disableCache?: boolean;
  // фабрика кэшей для `@tinkoff/request-plugin-cache-memory`
  createCache?: (options: any) => any;
  // время жизни кэша в `@tinkoff/request-plugin-cache-memory`
  cacheTime?: number;
  // ограничение по умолчанию на время выполнения запроса, в ms
  defaultTimeout?: number;
  // валидатор ответа для `@tinkoff/request-plugin-validate`
  validator?: RequestValidator;
  // валидатор ошибки для `@tinkoff/request-plugin-validate`
  errorValidator?: RequestValidator;
  // метод позволяет модифицировать объект ошибки перед отправкой логов из `@tinkoff/request-plugin-log`
  errorModificator?: RequestValidator;
}
```

### createTinkoffRequest

`createTinkoffRequest` - создает экземпляр `@tinkoff/request` со всеми необходимыми плагинами

```tsx
type createTinkoffRequest = (options: TinkoffRequestOptions) => MakeRequest;
```

### HttpClientAdapter

`HttpClientAdapter` - адаптирует `@tinkoff/request` к интерфейсу `HttpClient`.

Метод `request` оборачивает параметры запроса в опцию `modifyRequest`, и передает их в `@tinkoff/request`.
Затем, полученный ответ модифицируется в `HttpClientRequest`, и оборачивается в опцию `modifyResponse`.
Если произошла ошибка, то она оборачивается в опцию `modifyError`.

Метод `fork` создает новый экземпляр `HttpClientAdapter`, но с тем же самым экземпляром `@tinkoff/request`.

```tsx
type HttpClientAdapter = HttpClient;
```

### mergeOptions

По умолчанию, `mergeOptions` производит композицию опций `modifyRequest`, `modifyResponse` и `modifyError`, причем сначала будут выполнены соответствующие опции из параметра `options`, затем из `nextOptions`.
Если передать третий параметр `{ replace: true }`, все одноименные параметры из `options` просто будут перезаписаны параметрами из `nextOptions`

```tsx
type mergeOptions = (
  options: HttpClientRequest,
  nextOptions: HttpClientRequest,
  config?: { replace?: boolean }
) => HttpClientRequest;
```
