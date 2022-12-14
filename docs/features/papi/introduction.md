---
id: introduction
title: Papi introducton
---

# Papi

Papi - API routes for the `tramvai` application. The functionality is included in the module [@tramvai/module-server](references/modules/server.md) with the help of [@tramvai/papi](references/tramvai/papi.md)

## Explanation

Often, an application needs microservices that can process user requests and return JSON responses. It is to address these cases that PAPIs were developed. PAPi allows you to implement request handlers that clients can request and receive a response in an arbitrary format, for example, JSON. PAPI allows you to quickly and cheaply implement handlers without raising additional microservices.

## How to

### How to create papi

See examples on [how to create papi](how-to/how-create-papi.md) and [@tramvai/papi](references/tramvai/papi.md)

### How to get data from papi

`papi` is available at `/${appInfo.appName}/papi`. This url was chosen because it would divide many different papi services into 1 application domain.

For the example above with adding a route, the resulting url will look like this: `/${appInfo.appName}/papi/test` where appName is the name passed to `createApp`

To make a request, you need to use `PAPI_SERVICE` from the module `@tramvai/module-http-client`, which automatically on the client will make an http request to papi and on the server will simply call the handler function

### How can I get data from DI in papi routes

For the papi handler, it is possible to set the dependencies that it needs to work. Thus for each call a separate child di-container will be created, which will allow using both `SIGNLETON` and `REQUEST` dependencies.

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

### How to add a new papi route in the application

There are two ways to define routes. 1 - based on the file structure, 2 - task through providers

#### Using the file api approach

The easiest way to create a PAPI route is to create a directory `papi` in the root of the project in which to put TS files with handlers. The name of the files will be the URL to the route.

For example: we want to create a new papi handler that reads the body of the requests and summarizes the received values. To do this, create a file /papi/getSum.ts with the content:

<p>
<details>
<summary>papi/getSum.ts content</summary>

@inline ../../../examples/how-to/server-add-file-api/papi/getSum.ts

</details>
</p>

<p>
<details>
<summary>index.ts content</summary>

@inline ../../../examples/how-to/server-add-file-api/index.ts

</details>
</p>

This file can be requested using the client papi, or by calling the url `/${appName}/papi/getSum`

#### Using providers

It is necessary to add a multi provider `SERVER_MODULE_PAPI_PUBLIC_ROUTE` in which to add new papi routes

```tsx
import { createPapiMethod } from '@tramvai/papi';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get', // method, can be post, all and so on
        path: '/test', // path where the route will be available
        async handler() {
          // function that will be called if requests for url come
          return { test: true };
        },
      }),
    }),
  ],
})
export class PapiTestModule {}
```

And after that the test route will be available
