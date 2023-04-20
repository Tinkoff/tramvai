---
id: papi
title: Papi (API Routes)
---

Papi - API routes for the `tramvai` application. The functionality is included in the module [@tramvai/module-server](references/modules/server.md) with the help of [@tramvai/papi](references/tramvai/papi.md)

## Explanation

Often, an application needs microservices that can process user requests and return JSON responses. It is to address these cases that PAPIs were developed. PAPI allows you to implement request handlers that clients can request and receive a response in an arbitrary format, for example, JSON. PAPI allows you to quickly and cheaply implement handlers without raising additional microservices.

## Usage

### Prerequisites

You need to install `@tramvai/papi` library:

```bash
npx tramvai add @tramvai/papi
```

### Automatic handler creation

Let's consider on the basis of the case: it is necessary to create a separate api service which, according to an url like `${APP_ID}/papi/getSum` will return the sum of the passed parameters a and b

Based on the configuration parameter `<app>.serverApiDir` in tramvai.json (by default folder `./src/api`) the directory where the papi handlers are stored is determined. Create a new file in this folder with the name of our new handler, i.e. `getSum.ts` for our example. The default export from the file will be used as a handler, create it:

```tsx
import { createPapiMethod } from '@tramvai/papi';

export default createPapiMethod({
  async handler() {
    return 'hello';
  },
});
```

We restart the server so that the new handler is added to the papi list. The result of the function call will be used as the body of the response, so now if we turn to the address `http://localhost:3000/tincoin/papi/getSum`, then in the response we will receive an object with the property `payload: 'hello'`.

Next, let's add logic to our handler:

```tsx
import { createPapiMethod } from '@tramvai/papi';
import { PAPI_CACHE_TOKEN } from '../tokens'; // one of the app-defined tokens

// eslint-disable-next-line import/no-default-export
export default createPapiMethod({
  async handler({ body, requestManager }) {
    const { cache } = this.deps;
    const method = requestManager.getMethod();
    const { a, b } = body;

    if (method !== 'POST') {
      throw new Error('only post methods');
    }

    if (!a || !b) {
      return {
        error: true,
        message: 'body parameters a and b should be set',
      };
    }

    const key = `${a},${b}`;

    if (cache.has(key)) {
      return { error: false, fromCache: true, result: cache.get(key) };
    }

    const result = +a + +b;

    cache.set(key, result);

    return { error: false, fromCache: false, result };
  },
  deps: {
    cache: PAPI_CACHE_TOKEN,
  },
});
```

There is no need to restart the build, @tramvai/cli will rebuild everything itself after saving the changes to disk. Now you can make a POST request to `http://localhost:3000/tincoin/papi/getSum`, pass the parameters `a` and `b` and get the result.

### Creating a handler via provider

If you need to use other application dependencies from di in the handler, you can add a provider with the `SERVER_MODULE_PAPI_PUBLIC_ROUTE` token:

```tsx
// ...
import { createPapiMethod } from '@tramvai/papi';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { provide } from '@tramvai/core';

createApp({
  // ...
  providers: [
    // ...
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: () => {
        return createPapiMethod({
          method: 'get',
          path: '/ping',
          async handler() {
            this.log.error('/ping requested'); // log with the error level to see the log for sure
            return 'pong';
          },
        });
      },
    }),
  ],
});
```

Now you can make a request to the address `http://localhost:3000/tincoin/papi/ping`, in the response we will receive an object with the property `payload: 'pong'`,  in the terminal with the running process `tramvai start ${APP_ID}` we will see the error log `/ping requested`.

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

### How to get data from papi?

`papi` is available at `/${appInfo.appName}/papi`. This url was chosen because it would divide many different papi services into 1 application domain.

For the example above with adding a route, the resulting url will look like this: `/${appInfo.appName}/papi/test` where appName is the name passed to `createApp`

To make a request, you need to use `PAPI_SERVICE` from the module `@tramvai/module-http-client`, which automatically on the client will make an http request to papi and on the server will simply call the handler function

### How can I get data from DI in papi routes?

For the papi handler, it is possible to set the dependencies that it needs to work. Thus for each call a separate child di-container will be created, which will allow using both `SINGLETON` and `REQUEST` dependencies.

```tsx
import { Module, provide } from '@tramvai/core';
import { CREATE_CACHE_TOKEN } from '@tramvai/module-common';
import { HTTP_CLIENT } from '@tramvai/module-http-client';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/module-server';
import { createPapiMethod } from '@tramvai/papi';

@Module({
  providers: [
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: ({ createCache }) => {
        const cache = createCache(); // cache must be common for all handler calls, so we call it outside of createPapiMethod

        return createPapiMethod({
          path: '/my/papi',
          method: 'post',
          async handler({ httpClient }) {
            // use what was requested in deps from createPapiMethod
            if (cache.has('test')) {
              return 'test';
            }

            const { payload } = await httpClient.get('fake');
            return payload;
          },
          deps: {
            httpClient: HTTP_CLIENT, // the same dependency must be recreated for each call and they must be independent
          },
        });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN, // this is a dependency from the root container, which will be created only once
      },
    }),
  ],
})
export class PapiTestModule {}
```

## API Reference

### createPapiMethod

Options:

- `path` - specifies the path of url that current papi should handle. Required when specifying papi in tramvai DI, and not used when specified through file api.
- `method` - specified HTTP-method that is acceptable by current papi. By default, it equals to "all"
- `handler` - see [handler](#handler)
- `deps` - any DI deps that papi may require
- `options` - additional options that controls how current papi works
  - `timeout` - timeout for executing current papi. If timeout exceeded request is resolved with Execution timeout error.

#### handler

Function that accepts the details of the request and should return the response

Details of the request are passed with first parameter when handler is called. You can see available properties in typings when specifying papi method. It should provide most of the data that might be required to handle the request.

Additionally, through `this` you can get data that bounded to papi method:

- `deps` - resolved deps that were specified when defining papi method. Deps are resolved with [Child DI Container](concepts/di.md#container-is-a-child), so do not use it for creating caches as it won't work.
- `log` - instance of [LOGGER_TOKEN](references/modules/log.md#logger_token) bounded with current papi method

### isPapiMethod

Type guard to check is passed object is papi handler
