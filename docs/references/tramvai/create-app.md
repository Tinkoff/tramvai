---
id: create-app
title: createApp
---

`createApp` - конфигурация, создание и запуск приложения

## createApp({ modules, bundles, providers })

- `modules` - массив с используемыми [модулями](concepts/module.md) в приложении
- `bundles` - объект с подключаемыми бандлами с данными в приложении. Ключ - индетификатор бандла, значение - `Promise`, который возвращает bundle
- `providers` - массив с провайдерами приложения, которые будут добавлены в последнюю очередь в DI (после провайдеров модулей) и тем самым можно будет перезаписать реализацию токенов
- `actions` - массив с глобальными [экшенами](concepts/action.md), которые будут зарегистрированы для всех бандлов и страниц

## Пример использования

```tsx
import { createApp, provide } from '@tramvai/core';
import { RouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';

createApp({
  name: 'my-awesome-app',
  modules: [RouterModule, RenderModule, ServerModule],
  providers: [
    provide({
      provide: 'options',
      useValue: {},
    }),
  ],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault'),
  },
  actions: [loadDepositConfig],
});
```

После создания createApp запускается [СommandLineRunner](concepts/command-line-runner.md) который выполняет цепочку действий, необходимых для инициализации приложения.
