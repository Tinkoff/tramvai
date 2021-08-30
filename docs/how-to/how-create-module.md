---
id: how-create-module
title: Как создать модуль?
---

Рассмотрим на основе кейса: у нас появилась задача создать модуль, который для каждого клиента проставляет `X-Frame-Options`

В общем виде создание модуля можно разделить на несколько этапов:

1. Создаем пустой модуль
2. Добавляем необходимые провайдеры
3. Подключаем модуль в приложение

### Создаем пустой модуль

Создаем базовый модуль, для этого создаем пустой класс `SecurityModule` и подключаем декоратор `module` который необходим для модулей и в который мы будем добавлять интеграции с приложением.

```tsx
import { Module } from '@tramvai/core';

@Module({
  providers: [],
})
export class SecurityModule {}
```

Модуль уже можно подключить в приложение, но он не будет ничего делать.

### Добавляем провайдеры

Для этого нам необходимо добавить провайдеры в поле `providers`. У нас была задача добавить хэдеры, для этого мы будем использовать `commandLineListTokens`, что бы выполнять действия для каждого клиента и будем использовать `responseManager` в который сможем записать информацию о хэдерах.

```tsx
import { Module, commandLineListTokens, RESPONSE_MANAGER_TOKEN, provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: ({ responseManager }: { responseManager: typeof RESPONSE_MANAGER_TOKEN }) =>
        function securityHeader() {
          responseManager.setHeader('X-Frame-Options', 'sameorigin');
        },
      deps: {
        responseManager: RESPONSE_MANAGER_TOKEN,
      },
    }),
  ],
})
export class SecurityModule {}
```

Мы реализовали новый мульти-провайдер, который имеет зависимости и создается через `useFactory`

После подключения модуля в приложение, для каждого клиента сначала выполнится функция `useFactory` с переданными `deps`, и после этого вызовется функция `securityHeader`, в которой мы в полученную зависимость запишем данные, и тем самым выполним нашу цель.

### Подключаем в приложение наш новый модуль

Теперь осталось подключить модуль в приложение, что бы он смог добавить свою реализацию.

```tsx
import { createApp } from '@tramvai/core';
import { SecurityModule } from '@tramvai/module-security';

createApp({
  modules: [SecurityModule],
});
```

После этого модуль добавит свою реализацию и начнет выполняться.

Мы можем добавить модуль не только в приложение, но и в другой модуль. Для этого нужно передать в блок `imports` и тогда при подключении модуля `MyCommonModule` автоматически подключится и `SecurityModule`

```tsx
import { Module } from '@tramvai/core';
import { SecurityModule } from '@tramvai/module-security';

@Module({
  imports: [SecurityModule],
  providers: [],
})
export class MyCommonModule {}
```

### Итог

Был создан `SecurityModule` который будет вызываться для каждого клиента и будет добавлять необходимые хэдеры

- [Подробная дока по модулям](concepts/module.md)
- [Подробная дока по createApp](references/tramvai/create-app.md)
- [Подробная дока по DI](concepts/di.md)
