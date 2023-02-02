---
id: how-create-papi
title: How to create a papi handler?
---

Let's consider on the basis of the case: it is necessary to create a separate api service which, according to an url like `${APP_ID}/papi/getSum` will return the sum of the passed parameters a and b

## Automatic handler creation

Based on the configuration parameter `<app>.serverApiDir` in tramvai.json (by default folder `./src/api`) the directory where the papi handlers are stored is determined. Create a new file in this folder with the name of our new handler, i.e. `getSum.ts` for our example. The default export from the file will be used as a handler, create it:

```tsx
import { createPapiMethod } from '@tramvai/papi';

export default createPapiMethod ({
  async handler() {
    return 'hello';
  },
})
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

## Creating a handler via provider

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

### Additional links

- [@tramvai/papi documentation](references/tramvai/papi.md)
- [ServerModule documentation](references/modules/server.md)
