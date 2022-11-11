# @tramvai/module-mocker

Module uses library [@tinkoff/mocker](references/libs/mocker.md) to add a mocker functionality to the `tramvai` app. Mocker will be available as [papi](references/modules/server.md#papi) route with path `/mocker`.

## Installation

First, install `@tramvai/module-mocker`:

```bash npm2yarn
npm install @tramvai/module-mocker
```

Then, add your first mock to a new file `mocks/my-api.js`. In this file add export of object literal with the field `api` that should be specified as a name of environment variable for the API url that should be mocked:

```tsx
module.exports = {
  api: 'MY_API',
  mocks: {
    'GET /endpoint?foo=bar': {
      status: 200,
      headers: {},
      payload: {
        result: {
          type: 'json',
          value: {
            a: 'b',
          },
        },
      },
    },
  },
};
```

Add module to the project:

```tsx
import { createApp } from '@tramvai/core';
import { MockerModule } from '@tramvai/module-mocker';

createApp({
  name: 'tincoin',
  modules: [MockerModule],
});
```

Run app with env `MOCKER_ENABLED`, e.g.:

```bash
MOCKER_ENABLED="true" tramvai start tincoin
```

After that, all of the requests to `MY_API` in browser and on server will be automatically sent to mocker. In case mocker doesn't have a suitable mock the request, the request will be proxied to the original API.

## Explanation

Most of the mocker features are described in the [lib documentation](references/libs/mocker.md#Explanation).

Module adds mocker middleware to `papi` route `/mocker` and replaces all of the env variables that were defined in mocks by links to the `papi`. After that all of the request to the original API are routed first to mocker that accepts requests from the client and the server side.

By default, all of the API that were defined mocks are mocked, but it might be overridden.

Mocker us enabled only when env variable `MOCKER_ENABLED` is defined.

### Env variables replacement

Let's say app has env variable `MY_API: https://www.my-api.com/` and for that api some mock is defined.

The module can work locally, on dynamic stand, in test/stage environments. But this flexibility leads to the following problems when resolving path to the `papi` endpoint:

1. On server we should execute requests with absolute path. In this case we know that app is always available at `localhost` that mean we can replace API env variables by urls like `http://localhost:3000/tincoin/papi/mocker/MY_API/`
2. On client test stands we do not known the domain of the app. In this case we should make requests by relative urls that mean we can replace API env variables by urls like `/tincoin/papi/mocker/MY_API/`

Thanks to this env replacement we can redirect all of the request to the APIs to our mocker first automatically.

## How to

### Mock only specific API

By default, all of the API that has corresponding mock will be mocked. It might be overridden by passing list of the APIs to mock when initializing module:

```tsx
MockerModule.forRoot({
  config: async () => ({
    apis: ['MY_API'],
  }),
});
```

## Exported tokens

@inline src/tokens.ts
