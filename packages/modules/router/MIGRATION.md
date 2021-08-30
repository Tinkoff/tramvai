# Описание процесса миграции на модуль @tramvai/module-router

Миграция подразумевает уход от старых модулей: `@tramvai/module-route-base`, `@tramvai/module-route-spa` и переход на новый модуль [`@tramvai/module-router`](references/modules/router.md), который включает в себя функционал для спа и не-спа переходов.

## Заменяем старые модули на новые

```ts
import { createApp } from '@tramvai/core';
// Раньше
import { RouterBaseModule } from '@tramvai/module-route-base';
import { RouterSpaModule } from '@tramvai/module-route-spa';
// Теперь выбираем необходимый модуль из одного пакета
import { NoSpaRouterModule, SpaRouterModule } from '@tramvai/module-router';

createApp({
  name: 'tincoin',
  modules: [
    //...
    // Раньше
    RouterBaseModule, // старый базовый модуль для роутинга
    RouterSpaModule, // добавлял spa-переходы в роутинг

    // Теперь одно из двух
    NoSpaRouterModule, // если не нужны spa-переходы на клиенте
    SpaRouterModule, // если нужны spa-переходы на клиенте
    //...
  ],
});
```

## Интерфейс роута

Немного меняется интерфейс роута:

### Конфиг страниц

Вместо вложенного поля `properties` и отдельных конфигов страницы (вроде `httpStatus`) теперь всё предлагается хранить в одном общем поле `config` и из которого же можно будет получить все эти свойства на странице.

```ts
// Задание
const legacyRoutes = [
  {
    name: 'route',
    path: '/route',
    properties: {
      pageComponent: 'page',
    },
    httpStatus: 203,
  },
];

const newRoutes = [
  {
    name: 'route',
    path: '/route',
    config: {
      pageComponent: 'page',
      httpStatus: 203,
    },
  },
];

// Использование
import { PAGE_SERVICE } from '@tramvai/tokens-route';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

const pageLegacy = pageServiceLegacy.getCurrentRoute().config.properties.pageComponent;
const pageNew = pageServiceNew.getCurrentRoute().config.pageComponent;
```

## Задание статичных роутов

Токен переименован и немного поменялся формат, [согласно](references/modules/router.md#Задание-статичных-роутов-в-приложении)

```ts
// было
import { INITIAL_ROUTES_TOKEN } from '@tramvai/tokens-route';
// стало
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
```

## PageService

Заменить токен для PAGE_SERVICE на новый вариант:

```ts
// было
// import { PAGE_SERVICE } from '@tramvai/tokens-route'
// или
// import { PAGE_SERVICE } from '@tramvai/module-route'

// должно стать
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
```

Что поменялось:

- разделение роута и урла на две отдельные сущности: чтобы получить роут по прежнему надо обращаться к методу `getCurrentRoute`, чтобы получить урл - `getCurrentUrl`
- метод `getProperties` заменён на `getConfig` для соответствия с интерфейсом роута

Остальные изменения в основном косметические, подробнее про новый интерфейс в [доке модуля](references/modules/router.md)

## RouterStore

Имя стора остался прежним но поменялись [интерфейсы роута](#Интерфейс-роута)

- Для получения конфига страницы нужно обращаться к свойству `currentRoute.config` вместо `currentRoute.config.properties`
- Для получения урл надо обращаться к `currentUrl` вместо `currentRoute.parsedUrl`

## Router Guard

Изменился интерфейс для router guard подробнее в доке [@tinkoff/router](references/libs/router.md#Router%20Guards)

## Редиректы

Редиректы теперь задаются в [рамках роута](references/modules/router.md#Задание-редиректов). Достаточно перенести старые редиректы, задаваемые через токен `ROUTER_REDIRECT_MAP`

## NotFound роут

Вместо явного задания параметра `notFoundRoute` или токена `NOT_FOUND_ROUTE_TOKEN` роут можно задать в списке роутов с использованием символа `*`. Смотри [доку](references/modules/router.md#Not-Found-роут)

## Способ задания когда должны выполняться экшены при спа-переходах

Смотри доку [@tramvai/module-router](references/modules/router.md#Способ-задания-когда-должны-выполняться-экшены-при-спа-переходах)

## Устаревшие и неиспользуемые токены

- `ROUTER_EVENT_INIT` и `ROUTER_EVENT_LEAVE` удалены т.к. являются слишком специфичными и малоиспользуемыми
- `ROUTE_PLUGIN` удалён без предоставления замены, т.к. использование плагинов для низкоуровневой структуры роутинга создаёт сильную зависимость между приложением и самим роутингом
- `ENABLE_DELAY_ROUTER_STORE_DISPATCH_FEATURE` - удалён, новый роутинг по умолчанию не должен вызывать проблем
