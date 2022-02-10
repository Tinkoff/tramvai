---
id: how-create-module
title: How to create a module?
---

Let's use a case study: we have the task of creating a module that, for each client, puts `X-Frame-Options` header

In general, the creation of a module can be divided into several stages:

1. Create an empty module
2. Add the necessary providers
3. Include the module into the application

### Create an empty module

We create a basic module, to do this we create an empty class `SecurityModule` and connect the decorator `Module` which is required for modules and in which we will add integrations with the application.

```tsx
import { Module } from '@tramvai/core';

@Module({
  providers: [],
})
export class SecurityModule {}
```

The module can already be plugged into the application, but it won't do anything.

### Adding providers

To do this we need to add providers in the `providers` field. We had the task to add the headers, for that we will use `commandLineListTokens` to perform actions for each client and we will use `responseManager` to which we can write the information about the headers.

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

We have implemented a new multi-provider that has dependencies and is created through `useFactory`

After plugging the module into the application, for each client the `useFactory` function will be executed first with the `deps` passed and then the `securityHeader` function will be called, in which we will write the data into the obtained dependency and thus fulfill our goal.

### Include our new module in the application

Now it remains to plug the module into the application so that it can add its implementation:

```tsx
import { createApp } from '@tramvai/core';
import { SecurityModule } from '@tramvai/module-security';

createApp({
  modules: [SecurityModule],
});
```

We can add the module not only to the application, but also to another module. To do this, we need to pass in the `imports` block and then when the `MyCommonModule` is connected, the `SecurityModule` will also be automatically connected

```tsx
import { Module } from '@tramvai/core';
import { SecurityModule } from '@tramvai/module-security';

@Module({
  imports: [SecurityModule],
  providers: [],
})
export class MyCommonModule {}
```

### Summary

A `SecurityModule` was created, which will be called for each client and will add the necessary headers

- [Documentation about modules](concepts/module.md)
- [Documentation about createApp](references/tramvai/core.md#createApp)
- [Documentation about DI](concepts/di.md)
