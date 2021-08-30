# ReactQuery

Модуль, добавляющий интеграцию с библиотекой [react-query](https://react-query.tanstack.com/) и необходим для работы [@tramvai/react-query](features/react-query/api.md)

## Подключение

Необходимо установить `@tramvai/module-react-query`

```bash
yarn add @tramvai/module-react-query
```

И подключить в проекте

```tsx
import { createApp } from '@tramvai/core';
import { ReactQueryModule } from '@tramvai/module-react-query';

createApp({
  name: 'tincoin',
  modules: [...ReactQueryModule],
});
```

## Explanation

Модуль добавляет в DI инстанс [react-query QueryClient](https://react-query.tanstack.com/reference/QueryClient) и позволяет указывать через DI [опции для его создания](https://react-query.tanstack.com/reference/QueryClient#queryclientsetdefaultoptions).

Также модуль добавляет [React-обёртки для react-query](https://react-query.tanstack.com/reference/QueryClientProvider) в рендер приложения, которые позволяют использовать функции для работы с query внутри компонентов.

### Server

На сервере модуль также дополнительно выполняет дегидрацию предзагруженных на сервере данных, чтобы передать их на клиент

### Client

В браузере дополнительно выполняется регидрация данных предзагруженных на сервере.

## API

Модуль в основном предоставляет необходимые вещи в DI для работы библиотеки [@tramvai/react-query](features/react-query/api.md)и сам по себе может понадобится только если есть необходимость изменить настройки для QueryClient или использовать QueryClient напрямую (но лучше напрямую не использовать)

## Экспортируемые токены

@inline src/tokens.ts
