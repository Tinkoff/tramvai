---
id: create-app
title: createApp
---

`createApp` - configuring, creating and running the application

## createApp({ modules, bundles, providers })

- `modules` - array with used [modules](concepts/module.md) in the application
- `bundles` - object with used bundles with data in the application. The key is the bundle identifier, the value is `Promise` which returns the bundle
- `providers` - an array with application providers, which will be added last in the DI (after module providers) and thus it will be possible to overwrite the implementation of the tokens
- `actions` - array with global [actions](concepts/action.md), which will be registered for all bundles and pages

## Usage

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

After calling createApp, [СommandLineRunner](concepts/command-line-runner.md) is started which performs the chain of actions necessary to initialize the application.
