---
title: '@tramvai/papi'
sidebar_position: 4
---

# Papi

Library for creating and working with papi handlers. More on papi feature you can find [here](features/papi/introduction.md)

## Installation

You need to install `@tramvai/papi`

```bash npm2yarn
npm i @tramvai/papi
```

## Explanation

Library mostly provides strong typings to papi handlers and most of the logic of integration it to the tramvai app is done by [@tramvai/module-server](references/modules/server.md)

## Api

### createPapiMethod

Options:

- `path` - specifies the path of url that current papi should handle. Required when specifying papi in tramvai DI, and not used when specified through file api.
- `method` - specified HTTP-method that is acceptable by current papi. By default, it equals to "all"
- `handler` - see [handler](#handler)
- `deps` - any DI deps that papi may require
- `options` - additional options that controls how current papi works
  - `timeout` - timeout for executing current papi. If timeout exceeded request is resolved with Execution timeout error.

#### handler

Function that handles actual request and should return. It accepts the details of the request and should return the response

Details of the request are passed with first parameter when handler is called. You can see available properties in typings when specifying papi method. It should provide most of the data that might be required to handle the request.

Additionally, though `this` passed data that bounded to papi method:

- `deps` - resolved deps that were specified when defining papi method. Deps are resolved with [Child DI Container](concepts/di.md#container-is-a-child), so do not use it for creating caches as it won't work.
- `log` - instance of [LOGGER_TOKEN](references/modules/log.md#logger_token) bounded with current papi method

### isPapiMethod

Type guard to check is passed object is papi handler

## How to

### Create simple papi

```tsx
import { createPapiMethod } from '@tramvai/papi';

export const papi = createPapiMethod({
  // will handle requests to `/app/papi/my/papi` (actual url depends on setup)
  path: '/my/papi',
  // only requests with GET http method will be handled
  method: 'get',
  // function to return response to the client
  async handler() {
    return 'test';
  },
});
```

### Use parameters of the request

```tsx
import { createPapiMethod } from '@tramvai/papi';

export const papi = createPapiMethod({
  async handler({ parsedUrl: { query }, cookies }) {
    const { a, b } = query;
    const { testCookie } = cookie;

    return {
      testCookie,
      a,
      b,
    };
  },
});
```

### Settings headers and status

It can be done with [responseManager](references/tokens/common.md#responsemanager-tokens)

```tsx
import { createPapiMethod } from '@tramvai/papi';

export const papi = createPapiMethod({
  async handler({ responseManager }) {
    responseManager.setHeader('content-type', 'text/html');
    responseManager.setStatus(200);

    return `<html>...</html>`;
  },
});
```

### Use deps

```tsx
import { createPapiMethod } from '@tramvai/papi';

export const papi = createPapiMethod({
  async handler() {
    const { cookieManager } = this.deps;

    cookieManager.set({ name: 'b', value: 'abc', expires: 35 });

    return 'response';
  },
  deps: {
    cookieManager: COOKIE_MANAGER_TOKEN,
  },
});
```

### Use cache with deps

Deps are resolved with ChildContainer that means they are getting resolved on every request in order to provide request specific info. To use any of deps that should outlive scope of the request you should use provider that was initialized with [scope=SINGLETON](concepts/di.md#root-container)

For example, if you want to use some papi specific cache you should create new token and provide the cache instance with that token and with option `scope: Scope.SINGLETON`

```tsx
import { createToken, Scope, provide } from '@tinkoff/dippy';
import { createApp } from '@tramvai/core';
import { createPapiMethod } from '@tramvai/papi';
import { Cache, CREATE_CACHE_TOKEN } from '@tramvai/tokens-common';

export const PAPI_CACHE_TOKEN = createToken<Cache<string>>('app papi cache');

const app = createApp({
  // ...,
  providers: [
    // ...,
    provide({
      provide: PAPI_CACHE_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ createCache }) => {
        return createCache('memory');
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
    }),
  ],
});

export const papi = createPapiMethod({
  async handler({ parsedUrl: { query } }) {
    const { cacheKey } = query;
    const { cache } = this.deps;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const result = heavyComputation();

    cache.set(cacheKey, result);

    return result;
  },
  deps: {
    cache: PAPI_CACHE_TOKEN,
  },
});
```
