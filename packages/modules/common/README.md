# Common

Base module consisted of the architectural blocks for typical tramvai app. This module is required at most cases and is used a lot by the other modules.

## Installation

First install `@tramvai/module-common`

```bash npm2yarn
npm i @tramvai/module-common
```

Add CommonModule to the modules list

```tsx
import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';

createApp({
  modules: [CommonModule],
});
```

## Explanation

### Submodules

#### CommandModule

Module that adds implementation for the [commandLineRunner](concepts/command-line-runner.md) and defines default command lines

This module logs with id `command:command-line-runner`

#### StateModule

Adds state-manager

#### ActionModule

Implements [action system](concepts/action.md)

This module logs with id `action:action-page-runner`

#### CookieModule

Add providers that works with cookie. See [docs](references/modules/cookie.md)

#### EnvironmentModule

Implements work with environment variables both on server and client. See [docs](references/modules/env.md)

#### PubSub

Provides PubSub interface to implement communication between components. See [docs](references/libs/pubsub.md)

This modules logs with id `pubsub`

#### LogModule

Module for logging. Uses [`@tramvai/module-log`](references/modules/log.md)

#### CacheModule

Module that implements caches.

It provides next functionality:

- create new cache instance (currently it will be instance of lru-cache)
- clear all of the previously create caches
- subscribe on cache clearance event to execute own cache clearance actions
- adds papi-route `/clear-cache` that will trigger caches clear event

This modules logs wit id `cache:papi-clear-cache`

#### RequestManagerModule

Wrapper for the client request

#### ResponseManagerModule

Wrapper for the client response

## How to

### Create cache

```tsx
import { provide } from '@tramvai/core';

export const providers = [
  provide({
    provide: MY_MODULE_PROVIDER_FACTORY,
    scope: Scope.SINGLETON,
    useFactory: ({ createCache }) => {
      const cache = createCache('memory', ...args); // type of the cache and any additional options that will be passed to the cache constructor

      return someFactory({ cache });
    },
    deps: {
      createCache: CREATE_CACHE_TOKEN,
    },
  }),

  provide({
    provide: REGISTER_CLEAR_CACHE_TOKEN,
    scope: Scope.SINGLETON,
    useFactory: ({ cache }) => {
      return async () => {
        await cache.reset();
        console.log('my module cache cleared');
      };
    },
    deps: {
      cache: MY_MODULE_CACHE,
    },
  }),

  provide({
    provide: commandLineListTokens.clear,
    useFactory: ({ clearCache }) => {
      return function clear() {
        clearCache(); // clear caches explicitly
      };
    },
    deps: {
      clearCache: CLEAR_CACHE_TOKEN,
    },
  }),
];
```

## Exported tokens

- [tokens-common](references/tokens/common.md)
- [cookie](references/modules/cookie.md)
- [env](references/modules/env.md)
