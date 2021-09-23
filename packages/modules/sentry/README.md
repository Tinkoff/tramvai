# Sentry

Модуль интеграции с [Sentry](https://docs.sentry.io/), который подключает `Sentry SDK` для отправки отчетов об ошибках от клиента и сервера.

## Подключение в проект

### Переменные окружения

Обязательные:

- `SENTRY_DSN` - [DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) приложения

Опциональные:

- `SENTRY_RELEASE` - информация о текущем [релизе приложения](https://docs.sentry.io/workflow/releases/)
- `SENTRY_ENVIRONMENT` - информация об [окружении](https://docs.sentry.io/product/sentry-basics/environments/)
- `SENTRY_SDK_URL` - URL для загрузки Sentry SDK в браузере, задан по умолчанию
- `SENTRY_DSN_CLIENT` - [DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) приложения для использования только в браузере.

### Подключение модуля

`SentryModule` следует подключать в приложение одним из первых

```tsx
import { SentryModule } from '@tramvai/module-sentry';

createApp({
  modules: [SentryModule],
});
```

И обязательно добавьте `SENTRY_DSN` параметр на стендах. Иначе плагин не будет работать.

### Пример отправки кастомных ошибок

```tsx
import { createAction } from '@tramvai/core';
import { SENTRY_TOKEN } from '@tramvai/module-sentry';
import { loadUsers } from './users';

export default createAction({
  name: 'loadUsers',
  fn: async (context, _, { sentry }) => {
    try {
      await loadUsers();
    } catch (e) {
      sentry.captureException(e);
      throw e;
    }
  },
  deps: {
    sentry: SENTRY_TOKEN,
  },
});
```

## Локальный дебаг модуля

Локально Sentry отключен и если вы хотите оддебажить модуль, то необходимо явно включить Sentry

```tsx
SentryModule.forRoot({ enabled: true, debug: true });
```

И добавить в `env.development.js` параметр `SENTRY_DSN`

после этого Sentry включится при локальной разработке

## Получение DSN

Для этого:

- Зайдите в UI интерфейс Sentry
- Нажмите на таб `Settings`
- В табе `Projects` выберите свой проект
- Выберите `Client Keys (DSN)`
- Скопируйте текст с `Default` `DSN` поля.

## Sensitive Data

Прежде чем начать использовать модуль, следует ознакомиться с [документаций](https://docs.sentry.io/data-management/sensitive-data/) и в случае необходимости сконфигурировать под свое приложение

Sentry старается максимально обогощать [контекст ошибки](https://docs.sentry.io/platforms/javascript/enriching-events/), формируя [breadcrumbs](https://docs.sentry.io/platforms/javascript/enriching-events/breadcrumbs/) и получая информацию от [дополнительных интеграций](https://docs.sentry.io/platforms/javascript/configuration/integrations/). Все это можно конфигурировать, но следует внимательно следить за тем, какая информация в итоге попадает в Sentry хранилище.

## Поведение

Модуль использует universal подход, что позволяет логировать ошибки на клиенте и сервере. Интеграция c Sentry SDK происходит на шаге `commandLineListTokens.init`.

По умолчанию Sentry включается только для production и если имется DSN.

### Browser

Концептуально используется [lazy loaded подход](https://docs.sentry.io/platforms/javascript/install/lazy-load-sentry/) при котором Sentry SDK подключается динамически (возможно по необходимости), то есть `@sentry/browser` не попадает в итоговый бандл

### Node

Используется `@sentry/node` и [Sentry express middleware](https://docs.sentry.io/platforms/node/express/)

## Загрузка sourcemaps

Для загрузки sourcemaps в Sentry систему можно использовать [@sentry/cli](https://github.com/getsentry/sentry-cli).

Важно [правильно](https://docs.sentry.io/platforms/javascript/config/sourcemaps/#using-sentry-cli) указать `--url-prefix`.

[`--rewrite`](https://docs.sentry.io/cli/releases/#sentry-cli-sourcemaps) нужен, чтобы сократить размер загружаемых файлов и выполнить проверку валидности сорсмап

Пример такого скрипта для загрузки:

#### `ci/sentry-upload-sourcemaps`:

```sh
set -eu -o pipefail -x

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
VERSION=${SENTRY_RELEASE:-"${PACKAGE_VERSION}-${CI_COMMIT_SHA}"}
export SENTRY_PROJECT="${APP}"
export SENTRY_URL="${SENTRY_URL_TEST}"
export SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN_TEST}"
sentry-cli releases files $VERSION upload-sourcemaps --rewrite --url-prefix "~/" ./server/ & \
sentry-cli releases files $VERSION upload-sourcemaps --rewrite --url-prefix "~/platform/" ./assets/
```

Чтобы генерировались sourcemaps для сервера, нужно указать `"sourceMapServer": true` в `configurations` для приложения в `platform.json`.

## Экспортируемые токены

#### `SENTRY_TOKEN`

Подготовленный инстанс Sentry на основе Node SDK или Browser SDK

### `SENTRY_OPTIONS_TOKEN`

Опции для конфигурирования Sentry для [Node](https://docs.sentry.io/platforms/node/configuration/) и [Browser](https://docs.sentry.io/platforms/javascript/configuration/) окружений

### `SENTRY_REQUEST_OPTIONS_TOKEN`

Опции для [конфигурирования](https://docs.sentry.io/platforms/node/express/) парсера данных из запроса для express middleware

### `SENTRY_FILTER_ERRORS`

Позволяет передать функцию для фильтрации ошибок перед отправкой в Sentry. Механизм фильтрации описан в [документации Sentry](https://docs.sentry.io/platforms/javascript/configuration/filtering/), в функцию передаются аргументы `event` и `hint` метода `beforeSend`.
