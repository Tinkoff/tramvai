# ChildApp

Module for child app

## Installation

First, install `@tramvai/module-child-app`

```bash
yarn add @tramvai/module-child-app
```

And then add module to your app

```tsx
import { createApp } from '@tramvai/core';
import { ChildAppModule } from '@tramvai/module-child-app';

createApp({
  name: 'tincoin',
  modules: [ChildAppModule],
});
```

## Explanation

### Terms

- `root-app` - basic tramvai-app constructed with `createApp` from `@tramvai/core`. It can connect with many child-app
- `child-app` - external microfrontend constructed with `createChildApp` from `@tramvai/child-app-core`. It is loaded by root-app and provides some external functionality
- `SingletonDI` - DI-container which is exist in single instance for app and exists as long as app itself
- `RequestDI` - DI-Container which is created for every request and represents specific data for single client. RequestDI inherits providers from SingletonDI and it is independent from other RequestDIs
- `CommandLineRunner` - instance of [CommandModule](references/modules/common.md#commandmodule)

### Workflow

This section will explain how the child-app are loaded and executed.

#### Both SSR + Client hydration

1. Provider `CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN` will assemble all of the configs for child-apps that were provided through token `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` and resolve the configs on `resolvePageDeps` command line
2. Provider `CHILD_APP_RESOLVE_CONFIG_TOKEN` is used to generate config that are later consumable by child-app loader
3. Child-apps that will be rendered on the page should be preloaded with `CHILD_APP_PRELOAD_MANAGER_TOKEN` - see [preload child-app](#preload-child-app)

#### SSR

1. For every child-app that was preloaded server loads its code and executes all of the initialization - see [loading child-app](#loading-child-app)
2. Any child-app that were preloaded during request are added as script tag to client code to the output html
3. During render for child-apps their render code is executed to provide proper HTML
4. State is dehydrated for child-app the same time as root-app's state

#### Client hydration

1. For every child-app that was preloaded on server tramvai executes all of the initialization - see [loading child-app](#loading-child-app). In other cases initialization happens during first usage
2. If child-app was preloaded on server than client code should be loaded on page loaded. Otherwise tramvai will try to load client code on preload call on client side or during attempt to render child-app
3. During page render react will attempt to rehydrate render for child-apps that came from server. In case of errors it will rerender it from scratch

#### SPA navigations

1. During loading for next route child-app might be preloaded - it will be initialized during loading in that case otherwise child-app will be loaded as soon as it will be used.
2. While loading child-app it will render null. After loading child-app's render function will be used

### DI

Every child-app has its own DI-hierarchy which is isolated from other child app and partially from root-app. The only way communicate fpr DIs it's getting providers from root-app di inside child-app.

Next picture shows connection between DI-containers in `root-app` and `child-app`s

![di](/img/child-app/di.drawio.svg)

How does it work when we trying to get provider from DI in `child-app`:

1. First check that provider is exist in the current DI-container. If it is then return it.
2. If current DI is `RequestDI` then go to `SingletonDI` of `child-app` and look for provider.
   1. If it exists in `SingletonDI` then return it
   2. Go to `RequestDI` of `root-app` and if provider exists in it return it
   3. Go to `SingletonDI` of `root-app` and if provider exists in it return it
   4. Throw error otherwise
3. If current DI is `SingletonDI` then go to `SingletonDI` of `root-app` and check for provider there
   1. If it exists then return it
   2. Throw error otherwise

### CommandLineRunner

Each `child-app` has its own CommandLineRunner instance which allows to `child-app` make some preparations before the actual page render. This CommandLineRunner has almost identical lines as `root-app` to simplicity, but it is actually completely other line which are independent from lines in `root-app`

![command-line-runner](/img/child-app/command-line-runner.drawio.svg)

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
};
```

Child-app must be preloaded first to allow to execute commandline runner. In case of late preloading CommandLineRunner will be executed anyway but it will be out of sync with root-app CommandLineRunner (it will be called as soon as child-app code was loaded).

#### Server

- If child-app was preloaded before root-app `resolvePageDeps` then `customer` line list is executed on root-app `resolvePageDeps` line
- If child-app was preloaded on root-app `resolvePageDeps` then `customer` line list is executed as soon as child-app was loaded. `preload` call must be awaited in order to prevent root-app CommandLineRunner to passing to next line. That still counts as executing on `resolvePageDeps` line.
- Child-app `clear` line list is executed on root-app `clear` line for every child-app that was preloaded on previous lines

#### Client

##### First Page load

- If child-app was preloaded on server `customer` line list is executed on root-app `resolvePageDeps` line
- If child-app was not preloaded on server but was preloaded on client then `customer` line list is executed on root-app `clear` line
- Child-app `clear` line list is executed on root-app `clear` line for every child-app that was preloaded on previous lines

##### Spa-transitions

- If child-app was not preloaded on any previous pages before but was preloaded on next page then `customer` line list is executed as soon as child-app is loaded
- If child-app was preloaded on next page then child-app `spa` line list is executed on root-app `spaTransition` line

### Loading Child App

Loading of child-app is happens only after preloading child-app with `CHILD_APP_PRELOAD_MANAGER`. This preloading loads code for a child-app and marks it to execution using [CommandLineRunner](#commandlinerunner).

![loading](/img/child-app/loading.drawio.svg)

#### Server

- Calling `PreloadManager.preload(...)` loads a child-app code, executes and marks it as executable to CommandLineRunner
- Result of `PreloadManager.preload(...)` must be awaited as it is important to synchronize child-app commands lines execution with a root-app `CommandLinerRunner`
- Preloads after root-app `resolvePageDeps` are useless as they wont change page render and wont be used by root-app.

#### Client

- Calling `PreloadManager.preload(...)` loads a child-app code, executes and marks it as executable to CommandLineRunner
- Result of `PreloadManager.preload(...)` must be awaited as it is important to synchronize child-app commands lines execution with a root-app `CommandLinerRunner`
- If child-app was preloaded on server then child-app `customer` line list is executed on `resolvePageDeps` on first page render
- If child-app was not preloaded on server then actual loading and command-line execution are happens on root-app `clear` line as executing child-app before page render may break React hydration and should be executed only after it.
- On spa transition when previously child-app is preloaded it will be reused
- On spa transition if preloaded child-app was not loaded before it will be loaded and executed as soon as possible.

### State

State Management is almost completely isolated from root-app and other of child-apps. Every child-app can register own stores, actions.

State for child-apps will be dehydrated on server as separate variable in the result html and then will be automatically rehydrated on client for every child-app.

:::warning

By default, child-app cannot read data from root-app stores, but the you can specify the set of root-app stores that might be used inside child-app.

It may be done using `CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN` token.

This token is considered undesirable to use as it leads to high coupling with stores from root-app and this way stores in root-app might not change their public interface. But, in most cases, changes in stores ignore breaking change tracking and may breaks backward-compatibility. So **do not use this token if you can**, and if you should - use as little as possible from root-app and provide some fallback in case of wrong data.

[See how to do it](#child_app_internal_root_state_allowed_store_token)

:::

### Error handling

#### Error while loading child-app configs

Child-app configs might be loaded with providers for multi token `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` that are implemented in custom modules or in the app code.

Error that were raised in custom providers will be logged as errors under `child-app:resolution-config` key. After that there errors will be ignored and won't affect other resolutions, but the configs that could be loaded with that provider will be lost.

#### Child-app with specified name was not found

There is 2 causes that may lead to missing child-app in config:

- configs defined through `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` was failed and therefore there is no info about used child-app
- wrong naming of child-app

In any of that causes the error about missing child-app will be logged and the render for it will just return null.

If you are facing that problem first check the logs about errors for loading child-app configs than check that naming is right and such child-app exists in your configs.

#### Failed to load child-app code

Request to child-app code can fail by various causes.

If request has failed on server side the script tag with link to child-app client code will still be added to the html in order to try to load the child-app on client side. It will render fallback if provided or null on SSR (wrapped in Suspense for react@18) in that case and will try to resolve and render the child-app on the client.

If request has failed on client side it will render [fallback](#fallback) passing error or the default errorBoundary component.

#### Error during child-app render

Errors that happens inside child-app's render function

If render has failed on server side it will render fallback if provided or null otherwise. It may then proper rehydrated on client side.

If render has failed on client side it will render fallback with error if provided or default errorBoundary component

#### Error in commandLine handler

Any errors inside child-app commandLine execution will be logged and won't affect the execution of the root-app.

## API

### ChildApp

React component to render child-app with specified config in the react tree

```ts
import React from 'react';
import { ChildApp } from '@tramvai/module-child-app';

export const Page = () => {
  return (
    <div>
      ...
      <ChildApp name="[name]" />
      ...
    </div>
  );
};
```

#### fallback

React.ComponentType that will be rendered while child-app is loading (by default is null) or there was an error inside child-app (by default is a standard errorBoundary component)

### CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN

Defines the list of allowed root-app store names that might be used inside child-app.

1. Specify stores that might be used inside child-app

   ```ts
   provide({
     provide: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
     multi: true,
     useValue: [MediaStore, AuthenticateStore],
   });
   ```

2. Use the specified root-app stores the same way as usual stores

   ```ts
   import React from 'react';
   import { useSelector } from '@tramvai/state';

   export const StateCmp = () => {
     const value = useSelector(['root'], (state) => {
       return state.root.value;
     });

     return <div id="child-state">Current Value from Root Store: {value}</div>;
   };
   ```

## How to

### Connect a child app

1. Place a child-app React component somewhere in your page render

   ```ts
   import React from 'react';
   import { ChildApp } from '@tramvai/module-child-app';

   export const Page = () => {
     return (
       <div>
         ...
         <ChildApp name="[name]" />
         ...
       </div>
     );
   };
   ```

1. Add configuration for child-app loading

   ```ts
   providers: [
     provide({
       provide: CHILD_APP_RESOLVE_BASE_URL_TOKEN, // or use `CHILD_APP_EXTERNAL_URL` env
       useValue: 'http://localhost:4040/',
     }),
     provide({
       provide: CHILD_APP_RESOLUTION_CONFIGS_TOKEN,
       useValue: [
         {
           name: '[name]', // name of the child-app
           byTag: {
             latest: {
               version: '[version]', // current version for the child app for tag `latest`
             },
           },
         },
       ],
     }),
   ];
   ```

1. Preload child-app execution in order to improve performance and allow child-app execute its data preparations

   ```ts
   import { commandLineListTokens, Provider, provide } from '@tramvai/core';
   import { CHILD_APP_PRELOAD_MANAGER_TOKEN } from '@tramvai/module-child-app';

   const providers: Provider[] = [
     provide({
       provide: commandLineListTokens.customerStart,
       multi: true,
       useFactory: ({ preloadManager }) => {
         return function preloadHeaderChildApp() {
           return preloadManager.preload({ name: '[name]' }); // this call is important
         };
       },
       deps: {
         preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
       },
     }),
   ];
   ```

### Preload child-app

Preloading is vital for using child-app without extensive overhead on its loading.

You may preload using next ways:

1. Preload with `CHILD_APP_PRELOAD_MANAGER_TOKEN`

   ```ts
   provide({
     provide: commandLineListTokens.customerStart,
     multi: true,
     useFactory: ({ preloadManager }) => {
       return function preloadHeaderChildApp() {
         return preloadManager.preload({ name: '[name]' });
       };
     },
     deps: {
       preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,
     },
   });
   ```

1. Add needed child-apps to the pageComponent or layoutComponent through field `childApps`

```ts
import { PageComponent } from '@tramvai/react';

const PageCmp: PageComponent = () => {
  return 'Page';
};

PageCmp.childApps = [{ name: '[name]' }];
```

### Debug child-app problems

If your are facing any problems while developing or using child-app use next instructions first.

1. Check the logs with key `child-app` that may lead to source of problems
2. If there is not enough logs enable all `child-app` logs - [how to display logs](references/modules/log.md#display-logs)

### Run debug version of child-app

#### Single child-app

1. Run child-app using cli

   ```sh
   yarn tramvai start child-app
   ```

2. Run root-app with `CHILD_APP_DEBUG` environment variable

   ```sh
   CHILD_APP_DEBUG=child-app yarn tramvai start root-app
   ```

#### Multiple child-app

1. Run somehow multiple child-apps. They should be started on different ports.
2. And either pass `Base Url` showed from cli as url to debug every child-app

   ```sh
   CHILD_APP_DEBUG=child-app1=baseUrl1;child-app2=baseUrl2 yarn tramvai start root-app
   ```

3. Or implement proxy on default `http:://localhost:4040/` yourself which redirects to concrete server by url

   ```sh
   CHILD_APP_DEBUG=child-app1;child-app2 yarn tramvai start root-app
   ```

#### More detailed debug setup

You may specify a full config to debug to a specific child-app:

1. To token `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` for needed child-apps add special tag `debug`:
   ```ts
   ({
     name: 'child-app',
     byTag: {
       latest: {
         version: 'latest',
       },
       debug: {
         baseUrl: '...url',
         version: '...version',
         client: {},
         server: {},
         css: {},
       },
     },
   });
   ```
2. Run root-app with `CHILD_APP_DEBUG` environment variable with value of child-app names needed to debug

## Limitations

### Usage of envs

Child-app cannot control the environment variables and therefore should not use token `ENV_USED_TOKEN` at all. If you try to specify `ENV_USED_TOKEN` provider you will get error in development mode and in prod mode it will just be ignored.

Controlling of the envs content should be fully delegated to the root-app itself. Child-app can only use final values through `ENV_MANAGER_TOKEN` or any other options that passes data from root-app to child-app.

## Known issues

### This Suspense boundary received an update before it finished hydrating

When `React` >= `18` version is used, child-app will be wrapped in `Suspense` boundary for [Selective Hydration](https://github.com/reactwg/react-18/discussions/130). This optimization can significantly decrease Total Blocking Time metric of the page.

There is one drawback of this optimization - if you will try rerender child-app during selective hydration, `React` will switch to deopt mode and made full client-rendering of the child-app component. Potential ways to fix this problem [described here](https://github.com/facebook/react/issues/24476#issuecomment-1127800350). `ChildApp` component already wrapped in `React.memo`.

Few advices to avoid this problem:

- Memoize object, passed to child-app `props` property
- Prevent pass to child-app properties, which can be changed during hydration, for example at client-side in page actions
