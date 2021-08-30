---
id: bundle
title: Бандл
---

Бандлы позволяют выделить общие для разных страниц компоненты, редьюсеры и экшены.
Бандлы регистрируются для всего приложения, название актуального бандла берется из текущего роута, при совпадении, приложение инициализирует бандл:
- ищет в бандле компоненты, совпадающие с `pageComponent` и `layoutComponent` из роута, сохраняет их в общий регистр компонентов, затем эти компоненты использует `RenderModule` при рендеринге страницы
- сохраняет экшены в общий регистр экшенов
- регистрирует новые редьюсеры

Подробное описание интерфейса [createBundle](references/tramvai/create-bundle.md)

## Динамический импорт бандла

Для выделения ненужного на каждой странице кода, каждый бандл, передаваемый в `createApp`, должен иметь сигнатуру `() => Promise<{ default: Bundle }>`. Весь код, общий с подключаемыми в приложение модулями, останется в основном чанке приложения, и многие бандлы будут весить всего несколько КБ, но как только один из компонентов бандла подключит тяжелую зависимость, например библиотеку с формами, она полностью попадет в соответствующий бандл.

Рекомендуется использовать [dynamic import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) с магическим комментарием `webpackChunkName` для указания имени нового чанка, например:

```tsx
() => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault')
```

## Бандл по умолчанию

Каждый роут должен иметь свойства `bundle` с названием бандла, `pageComponent` и `layoutComponent` с названиями соответствующих компонентов.
По умолчанию задаются следующие значения:
- `bundle: 'mainDefault'`
- `pageComponent: 'pageDefault'`
- `layoutComponent: 'layoutDefault'`

При использовании стандартного `RenderModule`, подключается `LayoutModule`, который провайдит `layoutDefault` и отдельный механизм для расширения и переопределения layout в приложении, поэтому нет необходимости добавлять свойство `layoutDefault` в список `components` бандла.

Для создания бандла, который будет запускаться на всех страницах приложения, у которых отсутствуют специфичные настройки роутов, достаточно двух шагов:

#### Создаем бандл

```tsx
import { createBundle } from '@tramvai/core';
import { MainPage } from './pages/MainPage';

export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: MainPage,
  },
});
```

#### Подключаем бандл

```tsx
import { createApp } from '@tramvai/core';

createApp({
  name: 'myApp',
  modules: [
    // ...
  ],
  providers: [
    // ...
  ],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault'),
  },
});
```