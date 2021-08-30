---
id: create-bundle
title: createBundle
---

`createBundle(options: BundleOptions)` - метод для создания бандла.

[Подробнее про бандлы](concepts/bundle.md)

## Свойства BundleOptions

- `name` - Название бандла. Значение будет использоваться как индетификатор бандла.
- `components: {}` - Объект с зарегистрированными компонентами для бандла. Которые можно использовать и получать для отображения страницы
- `presets?: []` - Список модификаторов для текущего бандла. Этот список объединяется с текущим бандлом и получается итоговая конфигурация. Нужно для выделения общих частей, например пак с компонентами для авторизации. Похожая реализация реализована в пресетах babel
- `actions?: []` - Список [экшенов](concepts/action.md) которые будут зарегистрированы глобально для бандла
- `reducers?: []` - Список [редьюсеров](features/state/overview.md), которые необходимо зарегистрировать с загрузкой бандла

## Пример использования

```tsx
import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

createBundle({
  name: 'platform/account/profile',
  presets: [actionPackProfile],
  components: {
    'platform/pages/profile/ProfilePage': lazy(() => import('../pages/ProfileSettingsPage')),
    'platform/pages/profile/ProfilePurchasesPage': lazy(
      () => import('../pages/ProfilePurchasesPage')
    ),
  },
  actions: [variationLoadAction, platformAsyncBundle],
  reducers: [formReducer],
});
```
