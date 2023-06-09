---
id: workflow
title: How Child Apps work
---

## Workflow

This section will explain how the Child App are loaded and executed

### Both SSR + Client hydration

1. Provider `CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN` will assemble all of the configs for Child Apps that were provided through token `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` and resolve the configs on `resolvePageDeps` command line
2. Provider `CHILD_APP_RESOLVE_CONFIG_TOKEN` is used to generate config that are later consumable by Child App loader
3. Child Apps that will be rendered on the page should be preloaded with `CHILD_APP_PRELOAD_MANAGER_TOKEN` - see [Child App Preloading](03-features/015-child-app/010-connect.md#preloading)

### SSR

1. For every child-app that was preloaded server loads its code and executes all of the initialization - see [loading Child App](#loading-child-app)
2. Any Child App that were preloaded during request are added as script tag to client code to the output html
3. During render for Child Apps their render code is executed to provide proper HTML
4. State is dehydrated for Child App the same time as root-app's state

### Client hydration

1. For every Child App that was preloaded on server tramvai executes all of the initialization - see [loading Child App](#loading-child-app). In other cases initialization happens during first usage
2. If Child App was preloaded on server than client code should be loaded on page loaded. Otherwise tramvai will try to load client code on preload call on client side or during attempt to render Child App
3. During page render react will attempt to rehydrate render for Child Apps that came from server. In case of errors it will rerender it from scratch

### SPA navigations

1. During loading for next route Child App might be preloaded - it will be initialized during loading in that case otherwise Child App will be loaded as soon as it will be used.
2. While loading Child App it will render null. After loading Child App's render function will be used

## Loading Child App

Loading of Child App is happens only after preloading Child App with `CHILD_APP_PRELOAD_MANAGER`. This preloading loads code for a Child App and marks it to execution using [CommandLineRunner](#commandlinerunner).

![loading](/img/child-app/loading.drawio.svg)

### Server

- Calling `PreloadManager.preload(...)` loads a Child App code, executes and marks it as executable to CommandLineRunner
- Result of `PreloadManager.preload(...)` must be awaited as it is important to synchronize Child App commands lines execution with a root-app `CommandLinerRunner`
- Preloads after root-app `resolvePageDeps` are useless as they wont change page render and wont be used by root-app.

### Client

- Calling `PreloadManager.preload(...)` loads a Child App code, executes and marks it as executable to CommandLineRunner
- Result of `PreloadManager.preload(...)` must be awaited as it is important to synchronize Child App commands lines execution with a root-app `CommandLinerRunner`
- If Child App was preloaded on server then Child App `customer` line list is executed on `resolvePageDeps` on first page render
- If Child App was not preloaded on server then actual loading and command-line execution are happens on root-app `clear` line as executing Child App before page render may break React hydration and should be executed only after it.
- On spa transition when previously Child App is preloaded it will be reused
- On spa transition if preloaded Child App was not loaded before it will be loaded and executed as soon as possible.

### Dependency Injection

Every Child App has its own DI-hierarchy which is isolated from other Child App and partially from Root App. The only way communicate for DIs it's getting providers from Root App DI inside Child App.

Next picture shows connection between DI-containers in Root App and Child Apps:

![di](/img/child-app/di.drawio.svg)

How does it work when we trying to get provider from DI in Child App:

1. First check that provider is exist in the current DI-container. If it is then return it.
2. If current DI is `RequestDI` then go to `SingletonDI` of Child App and look for provider.
   1. If it exists in `SingletonDI` then return it
   2. Go to `RequestDI` of Root App and if provider exists in it return it
   3. Go to `SingletonDI` of Root App and if provider exists in it return it
   4. Throw error otherwise
3. If current DI is `SingletonDI` then go to `SingletonDI` of Root App and check for provider there
   1. If it exists then return it
   2. Throw error otherwise

There is a list of providers - exceptions, for which only factories will be borrowed, not instances, and new instances will be created in current Child-App DI:
- `COMMAND_LINE_RUNNER_TOKEN`
- `ACTION_EXECUTION_TOKEN`
- `ACTION_PAGE_RUNNER_TOKEN`
- `DISPATCHER_TOKEN`
- `STORE_TOKEN`
- `CONTEXT_TOKEN`
- `CREATE_CACHE_TOKEN`
- `CLEAR_CACHE_TOKEN`

### CommandLineRunner

Each `Child App` has its own CommandLineRunner instance which allows to `Child App` make some preparations before the actual page render. This CommandLineRunner has almost identical lines as `root-app` to simplicity, but it is actually completely other line which are independent from lines in `root-app`

All of the accepted line tokens:

```ts
const command = {
  customer: [
    commandLineListTokens.customerStart,
    commandLineListTokens.resolveUserDeps,
    commandLineListTokens.resolvePageDeps,
  ],
  clear: [commandLineListTokens.clear],
  spa: [
    commandLineListTokens.resolveUserDeps,
    commandLineListTokens.resolvePageDeps,
    commandLineListTokens.spaTransition,
  ],
  afterSpa: [commandLineListTokens.afterSpaTransition],
};
```

Child App must be preloaded first to allow to execute commandline runner. In case of late preloading CommandLineRunner will be executed anyway but it will be out of sync with root-app CommandLineRunner (it will be called as soon as Child App code was loaded).

More information in [Lifecycle documentation](03-features/015-child-app/06-lifecycle.md)
