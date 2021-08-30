# Common

Модуль, собравший в себя основные архитектурные блоки для работы приложения. Этот модуль необходим в большинстве случаев и добавляемые этим модулем провайдеры используются подавляющим числом других модулей.

## Подключение в проект

### 1. Зависимости

Необходимо установить `@tramvai/module-common` с помощью npm

```bash
npm i @tramvai/module-common
```

### 2. Подключение модуля

Нужно передать в список модулей приложения CommonModule

```tsx
import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';

createApp({
  modules: [CommonModule],
});
```

## Включенные модули

### CommandModule

Модуль которые добавляет в проект реализацию [commandLineRunner](concepts/command-line-runner.md) и дефолтных команд

Модуль использует логгер с идентификатором `command:command-line-runner`

### StateModule

Подключает и инициализирует state-manager в проекте

### ActionModule

Реализация системы [экшенов](concepts/action.md)

Модуль использует логгер с идентификатором `action:action-page-runner`

### CookieModule

Подключен модуль который позволяет работать с куками, [документация](references/modules/cookie.md)

### EnvironmentModule

Модуль для работы с env переменные в приложении на стороне сервера и клиента, [документация](references/modules/env.md)

### PubSub

Для отправки событий между модулями используется PubSub который позволяет отправлять сообщения и подписываться на изменения, [документация](references/libs/pubsub.md)

Модуль использует логгер с идентификатором `pubsub`

### LogModule

Минимальная реализация логгера для токена `LOGGER_TOKEN` без фильтров и дополнительных фич

### CacheModule

Модуль для работы с кешами. Функции:

- Создать новый инстанс кеша (на данный момент это lru-cache)
- Очистить все ранее созданные кеши
- Подписка на событие очистки кеша для реализации собственного тригера очистки своих кешей
- Добавляет papi-метод '/clear-cache' который генерирует событе очистки кешей

Модуль использует логгер с идентификатором `cache:papi-clear-cache`

#### Пример

```tsx
import { provide } from '@tramvai/core';

export const providers = [
  provide({
    provide: MY_MODULE_PROVIDER_FACTORY,
    scope: Scope.SINGLETON,
    useFactory: ({ createCache }) => {
      const cache = createCache('memory', ...args); // тип кеша и дополнительные аргументы которые будут переданы в конструктор кеша

      return someFactory({ cache });
    },
    deps: {
      createCache: CREATE_CACHE_TOKEN,
    },
  }),

  provide({
    provide: REGISTER_CLEAR_CACHE_TOKEN,
    scope: Scope.SINGLETON,
    useFactory: ({ cache }) => {
      return async () => {
        await cache.reset();
        console.log('my module cache cleared');
      };
    },
    deps: {
      cache: MY_MODULE_CACHE,
    },
  }),

  provide({
    provide: commandLineListTokens.clear,
    useFactory: ({ clearCache }) => {
      return function clear() {
        clearCache(); // очистить кеши явно в своем провайдере
      };
    },
    deps: {
      clearCache: CLEAR_CACHE_TOKEN,
    },
  }),
];
```

### RequestManagerModule

Модуль для работы с параметрами запроса

### ResponseManagerModule

Модуль для работы с параметрами ответа

## Экспортируемые токены

- [tokens-common](references/tokens/common-tokens.md)
- [cookie](references/modules/cookie.md)
- [env](references/modules/env.md)
