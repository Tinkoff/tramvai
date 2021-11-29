---
id: module
title: module
---

`Module` - Decorator for configuring and creating a module.

[Read more about modules](concepts/module.md)

## @Module({ providers, deps, imports })(class)

- `providers` - [Providers](concepts/provider.md), which will be added to the root DI container and become available in other modules
- `deps` - List of dependencies from the DI container, necessary to initialize the module
- `imports` - A list of modules from which providers will be obtained and added to the DI. Allows you to create modules that combine many other modules

## Usage

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
