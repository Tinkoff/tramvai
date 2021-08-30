# @tramvai/http-client

Абстрактный интерфейс `HttpClient` для стандартизации работы с внешними API в tramvai приложениях

## API

### HttpClient

```tsx
type HttpClient = {
  // универсальный метод для отправки HTTP запросов
  request<P = any>(request: HttpClientRequest): Promise<HttpClientResponse<P>>;
  // метод для отправки GET запросов
  get<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // метод для отправки POST запросов
  post<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // метод для отправки PUT запросов
  put<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // метод для отправки DELETE запросов
  delete<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ): Promise<HttpClientResponse<R>>;
  // метод для создания нового экземпляра HTTP клиента, на основе настроек текущего
  fork(options?: HttpClientRequest, mergeOptionsConfig?: { replace?: boolean }): HttpClient;
}
```

### HttpClientRequest

```tsx
type HttpClientRequest = {
  // абсолютный url запроса, не использовать одновременно с path
  url?: string;
  // относительный url запроса, не использовать одновременно с url
  path?: string;
  // базовый url, который добавляется ко всем запросам перед значением из `path`
  baseUrl?: string;
  // поддерживаются базовые HTTP методы - GET, POST, PUT, DELETE
  method?: HttpMethod;
  // тип данных, передаваемых с запросом, по умолчанию - json
  requestType?: HttpContentType;
  // тип данных, полученных в ответ, по умолчанию - json
  responseType?: HttpContentType;
  // HTTP заголовки запроса
  headers?: Record<string, any>;
  // query параметры запроса
  query?: Record<string, any>;
  // тело запроса
  body?: Record<string, any>;
  // ограничение на время выполнения запроса, в ms
  timeout?: number;
  // отключение логирования внутри HTTP клиента. Рекомендуется использовать, если ошибка запроса логируется самостоятельно
  silent?: boolean;
  // отключение использования кэша запросов
  cache?: boolean;
  // если `abortPromise` будет зарезолвлен, запрос будет отменен
  abortPromise?: Promise<void>;
  // метод для изменения данных запроса
  modifyRequest?: (req: HttpClientRequest) => HttpClientRequest;
  // метод для изменения данных ответа
  modifyResponse?: <P = any>(res: HttpClientResponse<P>) => HttpClientResponse<P>;
  // метод для изменения объекта ошибки
  modifyError?: (error: HttpClientError, req: HttpClientRequest) => HttpClientError;
  [key: string]: any;
}
```

### HttpClientResponse

```tsx
type HttpClientResponse<P = any> = {
  // тело ответа
  payload: P;
  // HTTP код ответа
  status: number;
  // HTTP заголовки ответа
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

`ApiService` - абстрактный класс для удобного создания сервисов для работы с API,
позволяет переопределить кастомную логику в методе `request`, поверх которого работают остальные базовые методы.

Например, сервис, который автоматически показывает всплывающее окно при ошибке запроса:

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

service.request({ path: 'fake' }) // покажет alert
service.get('fake') // также покажет alert
```
