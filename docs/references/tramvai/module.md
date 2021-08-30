---
id: module
title: module
---

`Module` - Декоратор для конфигурации и создания модуля.

[Подробнее про модули](concepts/module.md)

## @Module({ providers, deps, imports })(class)

- `providers` - [Провайдеры](concepts/provider.md), которые будут добавлены в общий DI контейнер и станут доступны в других модулях
- `deps` - Список зависимостей из DI контейнера, необходимые для инициализации модуля
- `imports` - Список модулей, из которых будут получены провайдеры и добавлены в DI. Позволяет создавать модули, которые объединяют множество других модулей

## Пример использования

```tsx
import { Module, provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: 'token',
      useValue: 'value-in-token',
    }),
  ],
  deps: {
    logger: 'logger',
  },
  imports: [ModuleLogger],
})
class ModulePubSub {
  constructor({ logger }) {
    logger.info('Module create');
  }
}
```
