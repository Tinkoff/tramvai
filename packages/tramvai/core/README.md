---
title: '@tramvai/core'
sidebar_position: 1
---

# Core

Ядро tramvai. В основном требуется для разработки модулей трамвая.

## API

### createApp


`createApp` - configuring, creating and running the application

#### createApp({ modules, bundles, providers })

- `modules` - array with used [modules](concepts/module.md) in the application
- `bundles` - object with used bundles with data in the application. The key is the bundle identifier, the value is `Promise` which returns the bundle
- `providers` - an array with application providers, which will be added last in the DI (after module providers) and thus it will be possible to overwrite the implementation of the tokens
- `actions` - array with global [actions](concepts/action.md), which will be registered for all bundles and pages

#### Usage

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

### declareAction

`declareAction` - Method for creating asynchronous actions. It is used both for building chains of sagas and for performing global actions when building a response to a client

[More about actions](concepts/action.md)

#### declareAction({ name, fn, deps, conditions })

- `name` - The name of the action, a unique identifier is expected
- `fn(...params)` - Implementation of the action, this function will be called when the action is used, maybe `async`
  - `this` - action execution context that contains some helper functions and resolved deps
  - `params` - data passed to action
- `deps` - List of providers that are needed for the action to work
- `conditions` - List of conditions for the execution of the action
- `conditionsFailResult` - [see](#conditionsfailresult)

#### Action Execution Context

Action execution context that contains some helper functions and resolved deps

Context has next fields:
- `deps` - resolved deps that were specified when declaring action
- `executeAction` - allows to execute another actions inside current one
- `getState` - quick access to `STORE_TOKEN.getState`
- `dispatch` - quick access to `STORE_TOKEN.dispatch`
- `abortSignal` - instance of signal related to the current execution tree
- `abortController` - instance of `AbortController` created exclusively for the current action execution

#### conditionsFailResult

Specifies the output of the action in case its `conditions` was not met during execution.

> If `conditions` are not met for action, action's `fn` won't be executed in any way

Possible values for the `conditionsFailResult`:
- `empty` - (default) execution will be resolved with `undefined` as a result
- `error` - execution will be rejected with [ConditionFailError](references/libs/errors.md#conditionfailerror)


#### Usage example

```tsx
import { declareAction } from '@tramvai/core';

declareAction({
  name: 'action log error',
  fn(payload) {
    this.deps.logger.error('ERROR');
  },
  deps: {
    logger: 'logger',
  },
  conditions: {
    requiredCoreRoles: ['god'],
  },
});
```

### createBundle

`createBundle(options: BundleOptions)` - method to create a bundle.

[Read more about bundles](concepts/bundle.md)

#### Properties BundleOptions

- `name` - Name of the bundle. The value will be used as a bundle identifier.
- `components: {}` - An object with registered components for the bundle, which you can use in application routes
- `presets?: []` - A list of additional properties for the current bundle. This list is merged with the current properties. Needed to extract common parts, e.g. a set with actions and components for authorization. Reference - babel and eslint presets
- `actions?: []` - List of [actions](concepts/action.md) that will be registered globally for the bundle
- `reducers?: []` - List of [reducers](03-features/08-state-management.md#reducer), which must be registered with the loading of the bundle

#### Usage

```tsx
import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

createBundle({
  name: 'app/bundle',
  presets: [commonPreset],
  components: {
    'app/pages/MainPage': lazy(() => import('../pages/MainPage')),
    'app/pages/SecondPage': lazy(() => import('../pages/SecondPage')),
  },
  actions: [fooAction, barAction],
  reducers: [bazReducer],
});
```

## Exported tokens

### DI_TOKEN

Dependency Injection container implementation

### APP_INFO_TOKEN

Information about running application

### COMMAND_LINE_RUNNER_TOKEN

CommandLineRunner implementation

### COMMAND_LINES_TOKEN

Commands for CommandLineRunner
