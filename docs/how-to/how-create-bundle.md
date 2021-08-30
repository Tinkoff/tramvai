---
id: how-create-bundle
title: Как создать бандл?
---

Bundle — это сборник ресурсов для страниц: компоненты, экшены, сторы. Каждый роут связан с каким-то бандлом который нужен ему для отображения.

Рассмотрим на основе кейса: у нас появился новый раздел на сайте, мы хотим создать новый бандл с отдельными страницами.

Создание и подключение бандла состоит из трех этапов:

1. Создание бандла
2. Наполнение компонентами
3. Подключение в приложении

### Создание бандла

Используем метод `createBundle` и создаем пустой бандл, в который записываем поле `name`,  которое является уникальным идентификатором бандла:

```tsx
import { createBundle } from '@tramvai/core';

export default createBundle({
  name: 'coin',
  components: {},
});
```

### Наполнение компонентами

Следующим этапом мы добавляем компоненты, которые будут доступны в этом бандле. Ключом являет идентификатор компонента, этот идентификатор можно будет привязать к роуту:

```tsx
import { createBundle } from '@tramvai/core';

import MainPage from '../pages/main';
import Layout from '../layouts';


export default createBundle({
  name: 'coin',
  components: {
    'page/coin-main': MainPage,
    'layout/coin-layout': Layout,
  },
});
```

При этом можно регистрировать любые компоненты и для разных целей. Например, мы можем зарегистрировать в бандле компоненты модальных окон, попапов и так далее. Вся эти компоненты будут доступны в `componentRegistry`.

### Подключение в приложение

Теперь нам осталось зарегистрировать бандл в приложении. Для этого добавляем в объект `bundles` у `createApp`:
* `ключ`: идентификатор бандла. Последняя часть должна быть одинаковой с идентификатором бандла, переданого в `name`, там используется функция вида`last('platform/coin'.split('/'))`, иначе не будет подзагрузка бандла на стороне сервера.
* `значение`: функция, которая должна вернуть промис, результатом которого будет передан объект. Обычно используют асинхронные чанки вебпака, но можно и написать кастомный лоадер обычных js файлов. Из особенностей, название чанка, должно быть синхронизировано с идентификатором `name`

```tsx
import { createApp } from '@tramvai/core';

createApp({
  bundles: {
    'platform/coin': () => import(/* webpackChunkName: "coin" */ './bundles/coin'),
  },
});
```

После этого у нас будет доступен в приложении бандл и после его загрузки, станут доступны привязанные компоненты. Дальше мы можем использовать эти компоненты в роутинге

* [Подробная дока по createBundle](references/tramvai/create-bundle.md)
* [Подробная дока по createApp](references/tramvai/create-app.md)

## Дефолтный бандл

Дефолтный бандл позволяет обрабатывать все (созданные через RouterModule.forRoot) урлы, для которых бандл не задан специально. Делается это так:

В index.ts

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

В файле `bundles/mainDefault.ts`

```tsx
import { createBundle } from '@tramvai/core'

import { MainPage } from '../layers/pages/MainPage'
import { Layout } from '../layers/layout/Layout'

export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: MainPage,
    layoutDefault: Layout,
  },
})
```
