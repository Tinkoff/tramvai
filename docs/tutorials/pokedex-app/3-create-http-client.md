---
id: create-http-client
title: Create HTTP client
---

So far we are developing a very boring application.
To display information about pokemon in our `Pokedex`, we need to get data from the `pokeapi` API.
In this lesson we will learn how to create API clients and work with the [Dependency Injection container](concepts/di.md).

:::info

Inversion of Control, and Dependency Injection (DI) are hard enough concepts to understand if you're dealing with them for the first time.
But using DI makes our applications incredibly flexible, extensible and modular.
The DI in `tramvai` is inspired by the dependency injection system in [Angular](https://angular.io/guide/dependency-injection).

:::

Module [@tramvai/module-http-client](references/modules/http-client.md) provides a factory for creating HTTP clients.

Important point! `tramvai` is built on the principle of [dependenciy injection](concepts/di.md), so the library does not export the factory directly, but adds it to the DI container of the application by a special [token](concepts/provider.md#tokens) as a key.
The DI allows you to construct the application from modules as if they were separate LEGO blocks. 

:hourglass: Install the library `@tramvai/module-http-client`:

```bash
tramvai add @tramvai/module-http-client
```

:hourglass: Connect `@tramvai/module-http-client` into the application:

```tsx title="index.ts"
import { HttpClientModule } from '@tramvai/module-http-client';

createApp({
  name: 'pokedex',
  modules: [
    ...modules,
    // highlight-next-line
    HttpClientModule,
  ],
  providers: [...providers],
  actions: [...actions],
  bundles: {...bundles},
});
```

Now we can create an API client specifically for `pokeapi`, let's make it a separate [tramvai module](concepts/module.md) right away to demonstrate module and DI capabilities.

:hourglass: Create a file `shared/api/index.ts` with an empty module:

```tsx title="shared/api/index.ts"
import { Module } from '@tramvai/core';

@Module({
  providers: [],
})
export class PokeApiModule {}
```

It is recommended to add base urls for different APIs to [application env variables via DI](references/modules/env.md) - this is useful for testing and mocking, and is consistent with [12-factor application](https://12factor.net/).

:hourglass: Add support for the new env variable in `PokeApiModule` with the `ENV_USED_TOKEN` token:

```tsx title="shared/api/index.ts"
// highlight-start
import { Module, provide } from '@tramvai/core';
import { ENV_USED_TOKEN } from '@tramvai/module-common';
// highlight-end

@Module({
  providers: [
    // highlight-start
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'POKEAPI_BASE_URL',
          optional: true,
          // default value
          value: 'https://pokeapi.co/api/v2/',
        },
      ],
    }),
    // highlight-end
  ]
})
export class PokeApiModule {}
```

In `value` property we immediately added a default value.
This value can be overridden in the `env.development.js` file when developing locally, or via environment variables when running the `tramvai` application on the server.

To add a new [provider](concepts/provider.md) to the DI, in this case a new HTTP client, you need two things:

- Create a token with the interface of the new HTTP client, with [HttpClient](references/libs/http-client.md#httpclient) as the interface
- Create provider with the implementation of this token, using the factory `HTTP_CLIENT_FACTORY`

:hourglass: Create a token for the new HTTP client:

```tsx title="shared/api/index.ts"
// highlight-next-line
import { Module, provide, createToken } from '@tramvai/core';
import { ENV_USED_TOKEN } from '@tramvai/module-common';
// highlight-start
import { HttpClient } from '@tramvai/module-http-client';

export const POKEAPI_HTTP_CLIENT = createToken<HttpClient>(
  'pokeapi HTTP client'
);
// highlight-end

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'POKEAPI_BASE_URL',
          optional: true,
          value: 'https://pokeapi.co/api/v2/',
        },
      ],
    }),
  ]
})
export class PokeApiModule {}
```

The `POKEAPI_HTTP_CLIENT` token can be used simultaneously as a key in the DI, and as an interface, with typeof - `typeof POKEAPI_HTTP_CLIENT`

:hourglass: Create a provider with an implementation of the `POKEAPI_HTTP_CLIENT` token:

```tsx title="shared/api/index.ts"
import { Module, provide, createToken } from '@tramvai/core';
// highlight-next-line
import { ENV_USED_TOKEN, ENV_MANAGER_TOKEN } from '@tramvai/module-common';
// highlight-next-line
import { HttpClient, HTTP_CLIENT_FACTORY } from '@tramvai/module-http-client';

export const POKEAPI_HTTP_CLIENT = createToken<HttpClient>('pokeapi HTTP client');

@Module({
  providers: [
    // highlight-start
    provide({
      provide: POKEAPI_HTTP_CLIENT,
      // what the useFactory call will return will be written to the DI,
      // and the dependency types will be derived automatically from the deps
      useFactory: ({ factory, envManager }) => {
        return factory({
          name: 'pokeapi',
          // используем базовый урл pokeapi из env переменной
          baseUrl: envManager.get('POKEAPI_BASE_URL'),
        });
      },
      // all dependencies from deps will be taken from DI and passed to useFactory
      deps: {
        factory: HTTP_CLIENT_FACTORY,
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    // highlight-end
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'POKEAPI_BASE_URL',
          optional: true,
          value: 'https://pokeapi.co/api/v2/',
        },
      ],
    }),
  ]
})
export class PokeApiModule {}
```

:::tip

A unique instance of `POKEAPI_HTTP_CLIENT` will be created for each user request to the application, allowing you to centralized add user data to the request parameters, for example you can take the `User-Agent` of the user and add it to the headers of all API requests.
In doing so, all these `POKEAPI_HTTP_CLIENT` instances will have a shared in-memory cache.
This cache can be disabled, for example for integration tests, with the env variable `HTTP_CLIENT_CACHE_DISABLED=true`.

:::

:hourglass: Connect `PokeApiModule` into the application:

```tsx title="index.ts"
import { HttpClientModule } from '@tramvai/module-http-client';
// highlight-next-line
import { PokeApiModule } from '~shared/api';

createApp({
  name: 'pokedex',
  modules: [
    ...modules,
    HttpClientModule,
    // highlight-next-line
    PokeApiModule,
  ],
  providers: [...providers],
  actions: [...actions],
  bundles: {...bundles},
});
```

Now we have a ready HTTP client that can be used in components, actions and other providers!

**[Next lesson](tutorials/pokedex-app/4-fetch-data.md)**
