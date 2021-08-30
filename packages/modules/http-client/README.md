# @tramvai/module-http-client

Модуль предоставляет в приложение фабрику HTTP клиентов, базовый сервис для работы с различными API и сервис для работы с `papi`.

## Подключение

Необходимо установить `@tramvai/module-http-client`

```bash
yarn add @tramvai/module-http-client
```

И подключить в проекте

```tsx
import { createApp } from '@tramvai/core';
import { HttpClientModule } from '@tramvai/module-http-client';

createApp({
  name: 'tincoin',
  modules: [HttpClientModule],
});
```

## Возможности

Модуль `http-client` добавляет в приложение функциональность, связанную с запросами к API. Доступные провайдеры позволяют создавать новые сервисы для работы с любым API и создавать более специфичные сервисы с предустановленными настройками под конкретные API.

Модуль реализует интерфейсы из библиотеки [@tramvai/http-client](references/libs/http-client.md) с помощью специальной библиотеки - адаптера [@tramvai/tinkoff-request-http-client-adapter](references/libs/tinkoff-request-http-client-adapter.md), работающей поверх [@tinkoff/request](https://tinkoffcreditsystems.github.io/tinkoff-request/).

## Концепции

### HTTP клиент

HTTP клиент - реализация интерфейса `HttpClient`, создается через токен `HTTP_CLIENT_FACTORY`. HTTP клиент принимает общие настройки, часть из которых будет использована в качестве defult значения для всех запросов. HTTP клиент не дает возможности добавить дополнительные методы для запросов, и совершать побочные действия при успешном или ошибочном завершении запроса.

### Сервис для работы с API

API сервис - наследник класса `ApiService`, который экспортируется из `@tramvai/http-client`. API сервис принимает HTTP клиент в конструкторе, и использует его для запросов. API сервис реализует все методы для запросов из интерфейса `HttpClient`, но позволяет модифицировать их. Например, можно заменить реализацию метода `request`, добавив на `catch` запроса через HTTP клиент показ сообщения об ошибке - эта логика автоматически будет срабатывать для всех остальных методов - `get`, `put`, `post`, `delete`. В API сервис можно добавить кастомные методы для запросов к определенным API эндпоинтам, и указывать в них только нужные параметры, и типизировать ответы.

## Использование

### Создание нового HTTP клиента

Каждый новый HTTP клиент должен быть прямым или косвенным наследником `HTTP_CLIENT_FACTORY`.

#### Базовый HTTP клиент

Токен `HTTP_CLIENT_FACTORY` - предоставляет фабрику для создания новых HTTP клиентов. В опциях предустановленны логгер и фабрика кэшей.

##### Особенности

- Для всех запросов в API добавляются заголовки из списка, возвращаемого токеном `API_CLIENT_PASS_HEADERS`, и `X-Real-Ip` из текущего запроса в приложение

**Интерфейс токена:**

```tsx
type HTTP_CLIENT_FACTORY = (options: HttpClientFactoryOptions) => HttpClient;
```

**Использование токена:**

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

### Использование существующих HTTP клиентов

Большинство HTTP клиентов реализует дополнительную логику для запросов, и наследуется от `ApiService`. Таким образом, у каждого сервиса есть методы `get`, `post`, `put`, `delete` и `request`, но могут быть и специфичные методы.

Новые HTTP клиенты / API сервисы не должны создаваться со `scope: Scope.SINGLETON`, т.к. в каждый запрос добавляются параметры по умолчанию, спецфичные для каждого пользователя, например - передача заголовка `X-Real-Ip` из запроса в приложение во все запросы к API.

Дополнительные причины создавать API сервисы - если для работы с конкретным API требуется использовать несколько разных HTTP клиентов, либо нужна возможность добавить удобную абстракцию поверх базовых методов для отправки запросов.

#### Универсальный HTTP клиент

Токен `HTTP_CLIENT` предоставляет базовый клиент для отправки запросов на любые урлы, кэширование запросов отключено.

**Использование токена:**

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

### Добавление пользовательских данных в запросы

Рассмотрим кейс на примере абстрактного сервиса `WHATEVER_API_SERVICE`. Допустим, мы хотим добавить в каждый запрос заголовок `X-Real-Ip`:

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

### Как отключить кэширование HTTP запросов?

Для отключения кэширования у всех HTTP клиентов, в приложение необходимо передать env переменную `HTTP_CLIENT_CACHE_DISABLED: true`

### Тестирование

#### Тестирование работы своих api-клиентов

Если у вас имеется модуль или провайдеры которые определяют апи-клиенты, то удобно будет использовать специальные утилиты для того чтобы протестировать их отдельно

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

## Экспортируемые токены

[ссылка](references/tokens/http-client-tokens.md)

## Переменные окружения

- `HTTP_CLIENT_CACHE_DISABLED` - отключение кэширования у всех HTTP-клиентов
- `HTTP_CLIENT_CIRCUIT_BREAKER_DISABLED` - отключение плагина https://tinkoffcreditsystems.github.io/tinkoff-request/docs/plugins/circuit-breaker.html
