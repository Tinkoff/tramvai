# @tramvai/module-router

Модуль для роутинга в приложении. Экспортирует два варианта модуля: с клиентскими спа-переходами и без.

## Подключение

Необходимо установить `@tramvai/module-router`

```bash
yarn add @tramvai/module-router
```

И подключить в проекте

```tsx
import { createApp } from '@tramvai/core';
import { NoSpaRouterModule, SpaRouterModule } from '@tramvai/module-router';

createApp({
  name: 'tincoin',
  modules: [SpaRouterModule],
  //modules: [ NoSpaRouterModule ], если нужно отключить клиентские спа-переходы
});
```

## Explanation

Модуль основан на библиотеке [@tinkoff/router](references/libs/router.md)

### Флоу работы навигации на сервере

![Диаграмма](/img/router/navigate-flow-server.drawio.svg)

### Флоу работы первой навигации на клиенте

![Диаграмма](/img/router/rehydrate-client.drawio.svg)

### Флоу работы навигации на клиенте без спа

![Диаграмма](/img/router/navigate-flow-client-no-spa.drawio.svg)

### Флоу работы навигации на клиенте со спа

![Диаграмма](/img/router/navigate-flow-client-spa.drawio.svg)

## API

### Задание статичных роутов в приложении

Формат описания роута:

```ts
const routes = [
  {
    // обязательно имя роута
    name: 'route1',
    // обязательно соответствующий path для роута
    path: '/route/a/',
    // дополнительные конфиги для роута
    config: {
      // имя компонента для layout
      layoutComponent: 'layout',
      // имя страничного компонента
      pageComponent: 'page',
    },
  },
];
```

Передать в роутинг список роутов можно явно при добавлении модуля роутинга:

```ts
import { createApp } from '@tramvai/core';
import { SpaRouterModule } from '@tramvai/module-router';

const routes = [
  // ...
];

createApp({
  modules: [
    // ...,
    SpaRouterModule.forRoot(routes),
  ],
});
```

Или отдельно токеном `ROUTES_TOKEN` (можно задавать несколько раз):

```ts
import { ROUTES_TOKEN } from '@tramvai/module-router';
import { provide } from '@tramvai/core';

const routesCommon = [
  // ...
];
const routesSpecific = [
  // ...
];

const providers = [
  // ...,
  provide({
    provide: ROUTES_TOKEN,
    multi: true,
    useValue: routesCommon,
  }),
  provide({
    provide: ROUTES_TOKEN,
    multi: true,
    useValue: routesSpecific,
  }),
];
```

### PAGE_SERVICE_TOKEN

Сервис-обёртка для работы с роутингом. Служит для скрытия работы с роутингом и является предпочтительным способом работы с роутингом.

Методы:

- `getCurrentRoute()` - получить текущий роут,
- `getCurrentUrl()` - объект-результат парсинга текущего урла
- `getConfig()` - получить конфиг текущей страницы
- `getContent()` - получить контент для текущей страницы
- `getMeta()` - получить мету для текущей страницы
- `navigate(options)` - навигация на новую страницу [подробнее](references/libs/router.md)
- `updateCurrentRoute(options)` - обновить текущий роут новыми параметрами [подробнее](references/libs/router.md)
- `back()` - переход по истории назад
- `forward()` - переход по истории вперёд
- `go(to)` - переход на указанную дельту по истории

### RouterStore

Стор, хранящий информацию о текущем и предыдущем роуте.

Свойства:

- `currentRoute` - текущий роут
- `currentUrl` - теущий урл
- `previousRoute` - предыдущий роут
- `previousUrl` - предыдущий урл

### ROUTER_GUARD_TOKEN

Позволяет блокировать или перенаправлять переход на страницу при определённых условиях. Подробнее смотри доку [@tinkoff/router](/references/libs/router.md)

### Задание редиректов

Редиректы могут выполняться через [guards](#ROUTER_GUARD_TOKEN) или явно через свойство `redirect` в роуте.

```ts
const routes = [
  // ...,
  {
    name: 'redirect',
    path: '/from/',
    redirect: '/to/',
  },
];
```

### Not Found роут

Роут, используемый, если не было найдено соответствий для текущей страницы можно задать специальным способом в списке роутов.

```ts
const route = [
  // ...other routes,
  {
    name: 'not-found',
    path: '*',
    config: {
      pageComponent: 'notfoundComponentName',
    },
  },
];
```

### ROUTE_RESOLVE_TOKEN

Позволяет задать асинхронную функцию, возвращающую объект роута, которая будет вызвана если не было найдено подходящего статичного роута в приложении.

### ROUTE_TRANSFORM_TOKEN

Функция-трансформер для роутов приложения (заданных статично и тех, что будут загружены через ROUTE_RESOLVE_TOKEN)

### Способ задания когда должны выполняться экшены при спа-переходах

По умолчанию при спа-переходах после определения следующего роута, но перед фактом самого перехода выполняются экшены, что позволяет отобразить страницу сразу с новыми данными, но может вызывать заметную визуальную задержку, если экшены выполняются достаточно долго.

Есть возможность поменять поведение и сделать выполнение экшенов уже после самого перехода. Тогда при разработке компонентов потребуется учитывать, что данные будут подгружаться по мере поступления.

Конфигурируется явно при использовании модуля роутинга:

```ts
import { createApp } from '@tramvai/core';
import { SpaRouterModule } from '@tramvai/module-router';

createApp({
  modules: [
    // ...,
    SpaRouterModule.forRoot([], {
      spaActionsMode: 'after', // по умолчанию 'before'
    }),
  ],
});
```

или токеном `ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN`:

```ts
import { ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN } from '@tramvai/module-router';
import { provide } from '@tramvai/core';

const providers = [
  // ...,
  provide({
    provide: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
    useValue: 'after',
  }),
];
```

## How to

### Работа с навигацией в провайдерах и экшенах

В этом случае лучше всего использовать токен [PAGE_SERVICE_TOKEN](#page_service_token)

```ts
import { provide, createAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

const provider = provide({
  provide: 'token',
  useFactory: ({ pageService }) => {
    if (pageService().getCurrentUrl().pathname === '/test/') {
      return pageService.navigate({ url: '/redirect/', replace: true });
    }
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});

const action = createAction({
  name: 'action',
  fn: (_, __, { pageService }) => {
    if (pageService.getConfig().pageComponent === 'pageComponent') {
      return page.updateCurrentRoute({ query: { test: 'true' } });
    }
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

### Работа с навигацией в React-компонентах

Работать с роутингом внутри React компонентов можно с помощью хуков и компонентов - useNavigate, useRoute, Link из пакета [@tinkoff/router](references/libs/router.md#интеграция-с-react)

<p>
<details>
<summary>Пример работы с навигацией в приложение</summary>

@inline ../../../examples/how-to/router-navigate/index.tsx

</details>
</p>

### Как задать статичные роуты

[RouterModule](references/modules/router.md) позволяет добавить новые роуты при конфигурации приложения. Второй способ, передавать статичные роуты в DI через токен `ROUTES_TOKEN`.

<p>
<details>
<summary>Пример добавления статичных роутов в приложение</summary>

@inline ../../../examples/how-to/router-static-routes/index.tsx

</details>
</p>

### Как задать Route Guard

[ROUTER_GUARD_TOKEN](references/modules/router.md#router_guard_token) задаются как асинхронная функция, что позволяет выполнять различные действия и влиять на поведение роутинга.

<p>
<details>
<summary>Пример задания router guards в приложении</summary>

@inline ../../../examples/how-to/router-guards/index.tsx

</details>
</p>

### Как задать Not found роут

Not-found роут используется в том случае, если для урла не найден соответствующий роут.

Такой роут задаётся в списке роутов со специальным символом `*` в свойстве `path`.

<p>
<details>
<summary>Пример задания Not-found роута в приложении</summary>

@inline ../../../examples/how-to/router-not-found/index.tsx

</details>
</p>

### Тестирование

#### Тестирование расширений ROUTER_GUARD_TOKEN

Если у вас имеется модуль или провайдеры которые определяют ROUTER_GUARD_TOKEN, то удобно будет использовать специальные утилиты для того чтобы протестировать их отдельно

```ts
import { ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';
import { testGuard } from '@tramvai/module-router/tests';
import { CustomModule } from './module';
import { providers } from './providers';

describe('router guards', () => {
  it('should redirect from guard', async () => {
    const { router } = testGuard({
      providers,
    });

    await router.navigate('/test/');

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/redirect/',
    });
  });

  it('should block navigation', async () => {
    const { router } = testGuard({
      modules: [CustomModule],
    });

    expect(router.getCurrentUrl()).toMatchObject({ path: '/' });

    await router.navigate('/test/').catch(() => null);

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/',
    });
  });
});
```

## Экспортируемые токены

[ссылка](references/tokens/router-tokens.md)
