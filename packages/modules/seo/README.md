# Seo

Модуль которые внутри себя получает данные из конфигурации страницы, генерирует мета теги и добавляет на страницу.

## Подключение

Необходимо установить `@tramvai/module-seo` с помощью npm

```bash
npm i @tramvai/module-seo
```

И подключить в проекте

```tsx
import { createApp } from '@tramvai/core';
import { SeoModule } from '@tramvai/module-seo';

createApp({
  name: 'tincoin',
  modules: [...SeoModule],
});
```

## Интеграция с tramvai

Модуль не добавляет публичное api в di для использования. Для рендера seo используется возможности @tramvai/module-render для вставки кода в html-страницу.

## Базовые источники данных

- `default` - список базовых пред установленных параметров
- `config/meta` - список мета параметров, которые были переданы и проставлены в блоке seo в админке

## Подключение дополнительных источников данных

Библиотека `@tinkoff/meta-tags-generate` позволяет подключать дополнительные источники данных для мета тегов с возможностью перезаписать базовые.

Для этого необходимо определить мульти провайдер `META_UPDATER_TOKEN`

```tsx
import { createApp, provide } from '@tramvai/core';
import { SeoModule, META_UPDATER_TOKEN, META_PRIORITY_ROUTE } from '@tramvai/module-seo';

const metaSpecial = (meta) => {
  meta.updateMeta(META_PRIORITY_ROUTE, {
    // приоритет - 10
    title: 'title', // ключ/значение в мете,
    metaCustom: {
      // подробная информация о формате [в доке](references/libs/meta-tags-generate.md)
      tag: 'meta',
      attributes: {
        name: 'metaCustomNameAttribute',
        content: 'metaCustomContent',
      },
    },
  });
};

createApp({
  providers: [
    provide({
      // либо добавить через провайдер
      provide: META_UPDATER_TOKEN,
      multi: true,
      useValue: metaSpecial,
    }),
  ],
  modules: [
    SeoModule.forRoot({
      list: [metaSpecial],
    }),
  ],
});
```

Каждый источник представляет собой функцию которая принимает meta и позволяет расширять мету через вызов _updateMeta_. Приоритет представляет собой положительное число, для каждого конкретного ключа меты будет использовано значение с наивысшим приоритетом, значение с приоритетом 0 обозначают значение по умолчанию.

Подробнее о формате [в доке](references/libs/meta-tags-generate.md)

## Установка seo данных динамически

Если требуется установить seo в страничном экшене или на одном из шагов commandLineRunner, то можно использовать явно сущность `MetaWalk` из либы `@tinkoff/meta-tags-generate`

```tsx
import { createAction } from '@tramvai/core';
import { META_WALK_TOKEN, META_PRIORITY_APP } from '@tramvai/module-seo';

createAction({
  name: 'action',
  fn: async (context, payload, { meta }) => {
    meta.updateMeta(META_PRIORITY_APP, {
      title: 'WoW, such dynamic!',
    });
  },
  deps: {
    meta: META_WALK_TOKEN,
  },
  conditions: {
    always: true,
  },
});
```

## Замена default seo данных

SEO модуль поставляется с default паком seo тегов. Если они вам не подходят, вы можете заменить реализацию провайдера и поставить свои данные:

```tsx
import { createApp } from '@tramvai/core';
import { SeoModule, META_DEFAULT_TOKEN } from '@tramvai/module-seo';

createApp({
  providers: [
    // Изменяем реализацию токена metaDefaultPack
    {
      provide: META_DEFAULT_TOKEN,
      useValue: { title: 'E Corp' },
    },
  ],
  modules: [SeoModule],
});
```

После этого у нас будут подставляться другие дефолтные параметры

## Meta параметры

В библиотеке уже предопределены часть базовых параметров для удобного использования при конфигурировании роутов.

И мы можем использовать мета параметры вида `title: 'Тинькофф'`

Список таких конвертеров, необходимо смотреть в файле src/converters/converters.ts

## How to

### Тестирование

#### Тестирование работы с META_UPDATER_TOKEN и META_DEFAULT_TOKEN

Если у вас имеется модуль или провайдеры которые определяют META_UPDATER_TOKEN или META_DEFAULT_TOKEN, то удобно будет использовать специальные утилиты для того чтобы протестировать их отдельно

```ts
import { Module, provide } from '@tramvai/core';
import { testMetaUpdater } from '@tramvai/module-seo/tests';
import { META_PRIORITY_APP, META_DEFAULT_TOKEN, META_UPDATER_TOKEN } from '@tramvai/module-seo';

describe('testMetaUpdater', () => {
  it('modules', async () => {
    const metaUpdater = jest.fn<
      ReturnType<typeof META_UPDATER_TOKEN>,
      Parameters<typeof META_UPDATER_TOKEN>
    >((walker) => {
      walker.updateMeta(META_PRIORITY_APP, {
        title: 'test title',
      });
    });
    @Module({
      providers: [
        provide({
          provide: META_UPDATER_TOKEN,
          multi: true,
          useValue: metaUpdater,
        }),
      ],
    })
    class CustomModule {}
    const { renderMeta } = testMetaUpdater({
      modules: [CustomModule],
    });

    const { render, metaWalk } = renderMeta();

    expect(metaWalk.get('title').value).toBe('test title');
    expect(render).toMatch('<title data-meta-dynamic="true">test title</title>');
  });

  it('providers', async () => {
    const { renderMeta } = testMetaUpdater({
      providers: [
        provide({
          provide: META_DEFAULT_TOKEN,
          useValue: {
            title: 'default title',
          },
        }),
      ],
    });

    const { render } = renderMeta();

    expect(render).toMatch('<title data-meta-dynamic="true">default title</title>');
  });
});
```
