---
id: create-action
title: createAction
---

`createAction` - Метод для создания асинхронных действий. Используется как для построения цепочек саг, так и для выполнения глобальных действий, при построении ответа клиенту

[Подробнее про экшены](concepts/action.md)

## createAction({ name, fn, deps, conditions })

- `name` - Название экшена, ожидается уникальный индетификатор
- `fn(context, payload, deps)` - Реализация экшена, эта функция будет вызвана при использовании экшена, может быть `async`
  - `context` - [ConsumerContext](references/tokens/common-tokens.md#список-context-токенов)
  - `payload` - данные, передаваемые в action
  - `deps` - инстансы провайдеров из `deps`
- `deps` - Список провайдеров, которые необходимы для работы экшена
- `conditions` - Список ограничений для исполнения экшена

## Пример использования

```tsx
import { createAction } from '@tramvai/core';

createAction({
  name: 'action log error',
  fn: (context, payload, deps) => {
    deps.logger.error('ERROR');
  },
  deps: {
    logger: 'logger',
  },
  conditions: {
    requiredCoreRoles: ['god'],
  },
});
```
