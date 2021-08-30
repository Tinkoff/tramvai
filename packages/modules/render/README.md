# RenderModule

Модуль для рендера react-приложения на сервере и в браузере

## Быстрый обзор

![init command](/img/tramvai/render-module.jpg)

Модуль который внутри себя содержит логику по генерацию html страницы, начиная от получения текущего компонента, так и заканчивая генерации конечного html c помощью библиотеки htmlpagebuilder.

Из особенностей, в этом модуле присутствует код создания верхнеуровнего реакт компонента, получения пэйдж компонента и лайаута из роутинга и создание композиции из провайдеров в приложении

## Подключение

Необходимо установить `@tramvai/module-render` с помощью npm

```bash
npm i @tramvai/module-render
```

И подключить в проекте

```tsx
import { createApp } from '@tramvai/core';
import { RenderModule } from '@tramvai/module-render';

createApp({
  name: 'tincoin',
  modules: [RenderModule],
});
```

## Explanation

### Разные режимы отрисовки React

Подробнее о режимах рендеринга можете узнать в [официальной доке](https://ru.reactjs.org/docs/concurrent-mode-adoption.html) в module-render есть поддержка всех типов и вы можете выбрать для своего приложения актуальный тип

Для задания режима, необходимо при инициализации `RenderModule` передать параметр `mode`

```typescript
RenderModule.forRoot({ mode: 'concurrent' });
```

Доступны варианты: `'legacy' | 'strict' | 'blocking' | 'concurrent'`

[Постепенная миграция на concurrent режим](#Как-можно-перевести-приложения-на-Concurrent-render-mode)

### Ассеты в приложении

Для работы с ресурсами в tramvai был разработан модуль ассетов который позволяет задать в DI список ресурсов и дальше их отрисовать в определенные слоты.

Пример:

```typescript
createApp({
  providers: [
    {
      multi: true,
      useValue: [
        {
          type: ResourceType.inlineScript, // inlineScript обернет payload в тег <script>
          slot: ResourceSlot.HEAD_CORE_SCRIPTS, // определяет позицию где в html будет вставлен ресурс
          payload: 'alert("render")',
        },
        {
          type: ResourceType.asIs, // asIs занчит вставить ресурс как есть. без обработки
          slot: ResourceSlot.BODY_TAIL,
          payload: '<div>hello from render slots</div>',
        },
      ],
    },
  ],
});
```

- **type** - тип ресурса, уже есть готовые пресеты которые упрощает добавление кода на страницу, без прокидывания дополнительных параметров и так далее
- **slot** - место в html странице, куда будет добавлен этот ресурс
- **payload** - что будет отрисовано

<p>
<details>
<summary>Доступные слоты</summary>

@inline src/server/constants/slots.ts

</details>
</p>

<p>
<details>
<summary>Схема разметки слотов в HTML странице</summary>

@inline src/server/htmlPageSchema.ts

</details>
</p>

[Как добавить загрузку ассетов на странице](#Как-добавить-загрузку-ассетов-на-странице)

### Автоматический инлайнинг ресурсов

#### Контекст

Большое количество файлов ресурсов создаёт проблемы при загрузке страницы, т.к. браузеру приходится создавать много соединений на небольшие файлы

#### Решение

Решили добавить возможность включить часть ресурсов прямо в приходящий с сервера HTML. Чтобы не инлайнить вообще всё, добавлена возможность задать верхнюю границу размера файлов.

#### Подключение и конфигурация

С версии 0.60.7 инлайнинг для стилей включен по умолчанию, инлайнятся CSS-файлы размером меньше 40kb до gzip (+-10kb после gzip).
Для переопределения этих настроек нужно добавить провайдер с указанием типов ресурсов, которые будут инлайниться (стили и\или скрипты), а также верхнюю границу размера файлов (в байтах, до gzip):

```js
import { RESOURCE_INLINE_OPTIONS } from '@tramvai/tokens-render';
import { ResourceType } from '@tramvai/tokens-render';
import { provide } from '@tramvai/core';

provide({
  provide: RESOURCE_INLINE_OPTIONS,
  useValue: {
    types: [ResourceType.script, ResourceType.style], // Включаем для стилей и скриптов
    threshold: 1024, // 1kb unzipped
  },
}),
```

#### Особенности

Инлайнятся все скрипты и\или стили (в зависимости от настроек), зарегистрированные через ResourcesRegistry

Загрузка файлов на сервере происходит в lazy-режиме асинхронно. Это означает, что при первой загрузке страницы инлайнинга не будет происходить. Также это означает, что никакого дополнительного ожидания загрузки ресурсов на стороне сервера не происходит. После попадания файла в кэш он будет инлайниться. Кэш имеет TTL 30 минут, сброс кэша не предусмотрен.

### Автоматический предзагрузка ассетов приложений

Для ускорения загрузки данных добавлена система подзагрузки данных для ресурсов и асинхронных чанков, которая работает по следующему сценарию:

- После рендеринга приложения мы получаем информацию о всех используемых в приложении css, js и асинхронных чанках
- Дальше добавляем все css в прелоад тег и навешиваем onload событие. Нам необходимо максимально быстро загрузить блокирующие ресурсы.
- При загрузке любого css файла, добавляем в предзагрузку все необходимые js файлы

#### Особенности

Обязательно должен быть синхронизирована последняя часть идентификатора бандла с названием чанка

```
const dashboard = () => require.ensure([], (require) => require('./bundles/dashboard'), 'dashboard');
bundles: {
  'platform/mvno/dashboard': dashboard,
}
```

или если используете import

```
const dashboard = () => import(/* webpackChunkName: "dashboard" */ './bundles/dashboard');
bundles: {
  'platform/mvno/dashboard': dashboard,
}
```

В примере выше, 'dashboard' и last('platform/mvno/dashboard'.split('/')) имеют одинаковое значение. Иначе мы не сможем на стороне сервера узнать, какой из списка чанков подходит в бандлу и подзагрузка произойдет только на стороне клиента.

### Базовый layout

В module-render встроен дефолтный базовый layout, который поддерживает различные способы расширения и добавления функциональности

[Подробнее про лайаут можете почитать на странице библиотеке](references/libs/layout-factory.md)

#### Добавление базовых header и footer

Можно добавить компоненты header и footer, которые будут отрисовываться по умолчанию для всех страниц

##### Через провайдер

Зарегистрировать компоненты header и footer через провайдеры

```tsx
import { DEFAULT_HEADER_COMPONENT, DEFAULT_FOOTER_COMPONENT } from '@tramvai/tokens-render';
import { provide } from '@tramvai/core';

createApp({
  providers: [
    provide({
      provide: DEFAULT_HEADER_COMPONENT,
      useValue: DefaultHeader,
    }),
    provide({
      provide: DEFAULT_FOOTER_COMPONENT,
      useValue: DefaultFooter,
    }),
  ],
});
```

##### Через бандл

Можно зарегистрировать в бандле компонент `headerDefault` и `footerDefault`, которые будет отрисовываться для всех роутов, у которых не переопределены `headerComponent` и `footerComponent`.

```tsx
createBundle({
  name: 'common-bundle',
  components: {
    headerDefault: CustomHeader,
    footerDefault: CustomFooter,
  },
});
```

#### Добавление компонентов и враперов

Добавить кастомные компоненты и врапперы для layout можно через токен `LAYOUT_OPTIONS`

```tsx
import { provide } from '@tramvai/core';
@Module({
  providers: [
    provide({
      provide: 'LAYOUT_OPTIONS',
      multi: true,
      useValue: {
        // react компоненты
        components: {
          // базовые кастомные компоненты врапперы для отрисовки страницы и контента
          content: Content,
          page: Page,

          // глобальные компоненты
          alerts: Alerts,
          feedback: Feedback,
        },
        // HOC для компонентов
        wrappers: {
          layout: layoutWrapper,
          alerts: [alertWrapper1, alertWrapper2],
        },
      },
    }),
  ],
})
export class MyLayoutModule {}
```

Подробнее про опции `components` и `wrappers` можно узнать в [@tinkoff/layout-factory](references/libs/layout-factory.md)

#### Замена базового layout

Если вам не подходит базовый лайаут, вы можете его подменить на любой другой React компонент. При этом вам нужно самостоятельно реализовывать все врапперы и подключать глобальные компоненты, если они вам нужны.

Заменить можно двумя способами:

##### Добавить layoutComponent у роута

Вы можете прописать параметр `layoutComponent` у роута в `properties` и зарегистрировать компонент в `bundle`. При отрисовке страницы отобразится зарегистрированный компонент

```tsx
createBundle({
  name: 'common-bundle',
  components: {
    myCustomLayout: CustomLayout,
  },
});
```

##### Переопределить layoutDefault

Вы можете зарегистрировать в бандле компонент `layoutDefault` который автоматически будет отрисовываться для всех роутов, у которых не переопределен `layoutComponent`

```tsx
createBundle({
  name: 'common-bundle',
  components: {
    layoutDefault: CustomLayout,
  },
});
```

## How to

### Как добавить загрузку ассетов на странице

Присутствует 2 способа, как можно добавить ресурсы в приложение

- токен `RENDER_SLOTS`, в который можно передать список ресурсов, например HTML разметка, inline скрипты, тег script
- токен `RESOURCES_REGISTRY` для получения менеджера ресурсов, и регистрации нужных ресурсов вручную

Пример:

<p>
<details>
<summary>Пример приложения</summary>

@inline ../../../examples/how-to/render-add-resources/index.tsx

</details>
</p>

### Как можно перевести приложения на Concurrent render mode

React позволяет выполнить постепенную миграцию приложения

**Этапы миграции:**

1. [Strict Mode](https://reactjs.org/docs/strict-mode.html) - строгий режим, в котором React предупреждает об использовании легаси API

Для подключения необходимо сконфигурировать render-module

```
modules: [
  RenderModule.forRoot({ mode: 'strict' })
]
```

Затем необходимо исправить все новые предупреждения, такие как использование легаси методов жизненного цикла и строковые рефы.

2. [Blocking Mode](https://reactjs.org/docs/concurrent-mode-adoption.html#migration-step-blocking-mode) - добавляет часть возможностей Concurrent Mode, например Suspense на сервере. Подходит для постепенной миграции на Concurrent Mode.

Для подключения необходимо установить экспериментальную версию React и сконфигурировать render-module

```bash
npm install react@experimental react-dom@experimental
```

```
modules: [
  RenderModule.forRoot({ mode: 'blocking' })
]
```

На этом этапе надо проверить работоспособность приложения, и можно попробовать новые API, например [SuspenseList](https://reactjs.org/docs/concurrent-mode-patterns.html#suspenselist)

3. Concurrent Mode

Для подключения необходимо установить экспериментальную версию React и сконфигурировать render-module

```bash
npm install react@experimental react-dom@experimental
```

```
modules: [
  RenderModule.forRoot({ mode: 'concurrent' })
]
```

На этом этапе надо проверить работоспособность приложения, и можно попробовать новые API, например [useTransition](https://reactjs.org/docs/concurrent-mode-patterns.html#transitions)

### Тестирование

#### Тестирование расширений рендера через токены RENDER_SLOTS или RESOURCES_REGISTRY

Если у вас имеется модуль или провайдеры которые определяют RENDER_SLOTS или используют RESOURCES_REGISTRY, то удобно будет использовать специальные утилиты для того чтобы протестировать их отдельно

```ts
import {
  RENDER_SLOTS,
  ResourceSlot,
  RESOURCES_REGISTRY,
  ResourceType,
} from '@tramvai/tokens-render';
import { testPageResources } from '@tramvai/module-render/tests';
import { CustomModule } from './module';
import { providers } from './providers';

describe('testPageResources', () => {
  it('modules', async () => {
    const { render } = testPageResources({
      modules: [CustomModule],
    });
    const { head } = render();

    expect(head).toMatchInlineSnapshot(`
"
<meta charset=\\"UTF-8\\">
<script>console.log(\\"from module!\\")</script>
"
`);
  });

  it('providers', async () => {
    const { render, runLine } = testPageResources({
      providers,
    });

    expect(render().body).toMatchInlineSnapshot(`
"
"
  `);

    await runLine(commandLineListTokens.resolvePageDeps);

    expect(render().body).toMatchInlineSnapshot(`
"
<script defer=\\"defer\\" charset=\\"utf-8\\" crossorigin=\\"anonymous\\" src=\\"https://scripts.org/script.js\\"></script>
<span>I\`m body!!!</span>
"
  `);
  });
});
```

## Экспортируемые токены

[ссылка](references/tokens/render-tokens.md)
