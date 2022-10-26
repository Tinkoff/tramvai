---
id: provider
title: Provider
sidebar_position: 3
---

provider is a simple object that provides an implementation for an interface (identifier) ​​for a particular dependency. An implementation can be a constant value (string, function, symbol, class instance), factory, or class. A factory or class is initialized upon request to the corresponding identifier. It is possible to register several providers for one token, if the `multi` parameter is present.

## Format

```tsx
type Provider = {
  provide: Token | string; // provider id
  useValue?: any; // implementation of the identifier
  useFactory?: any; // implementation of the identifier
  useClass?: any; // implementation of the identifier
  deps?: Record<string, Token | string>; // list of dependencies that the provider needs to work
  multi?: boolean; // the ability to register multiple provider implementations, if true, when receiving the value of this identifier, all registered values ​​will come in the scope array
  scope?: 'request' | 'singleton'; // If a singleton, then the container will register one instance of the provider for all client requests. If request will create its own instance for each client and Request
};
```

## Types of providers

### Class

When the instance is initialized, the class passed to `useClass` will be created, if `deps` were specified, then the class will be called with the object of implementations as the first argument

```tsx
import { provide } from '@tramvai/core';
const provider = provide({
  provide: 'token',
  useClass: class ImplementClass {
    constructor({ logger }) {}
  },
  deps: {
    logger: 'logger',
  },
});
```

### Factory

When the instance is initialized, the function passed to `useFactory` will be called, if `deps` were specified, then the function will be called with the object of implementations as the first argument

```tsx
import { provide } from '@tramvai/core';
const provider = provide({
  provide: 'token',
  useFactory: ({ logger }) => new Implement(logger),
  deps: {
    logger: 'logger',
  },
});
```

### Value

Sets the provider's value to the data that was passed in the `useValue` parameter, no additional initialization will be performed and `deps` cannot be used

```tsx
import { provide } from '@tramvai/core';
const provider = provide({
  provide: 'token',
  useValue: { appName: 'APP' },
});
```

## Multi providers

We may need to be able to register multiple implementations for a single token. For example, several actions for one step. To implement this, you need to pass the `multi` parameter to the provider. In this case, an array of providers is stored in the di container:

```tsx
import { provide } from '@tramvai/core';
const providers = [
  provide({
    provide: 'token',
    multi: true,
    useValue: { route: '/' },
  }),
  provide({
    provide: 'token',
    multi: true,
    useValue: { route: '/cards' },
  }),
];
```

## Dependencies (deps)

Needed to specify the dependencies that are needed for the provider to work. When creating a provider, dependency instances will be created, which are specified in deps and passed to the provider as the first argument. The keys of the deps object will be the implementations that will be sent to the provider. In this case, if the provider is not found in the global DI, an error will be thrown notifying that the current token was not found.

### Format

```tsx
type Provider = {
  deps: {
    [key: string]:
      | Token
      | {
          token: Token;
          optional?: boolean;
          multi?: boolean;
        };
  };
};
```

### Optional Dependencies

We don't always need mandatory dependencies to work. And we want to point out that the dependency is not necessary to work and it is not necessary to throw an error. To do this, you can pass the `optional` parameter, which will disable throwing an error if there is no dependency. Instead of implementing the dependency, the provider will receive the value `null`.

```tsx
import { provide } from '@tramvai/core';

const provider = provide({
  provide: 'token',
  useClass: class A {
    constructor({ log }) {}
  },
  deps: {
    log: {
      token: 'log',
      optional: true,
    },
  } as const,
});
```

### Multi dependencies

Some providers are multi-providers and instead of one implementation, we will receive an array of implementations. For correct type inference, we must pass the `multi: true` parameter, apply `as const` for the `deps` block for correct type inference via TS:

```tsx
import { provide } from '@tramvai/core';

const COMMANDS_TOKEN = createToken<string>('commands', { multi: true });

const provider = provide({
  provide: 'token',
  useClass: class A {
    constructor({ commands }) {
      commands.forEach();
    }
  },
  deps: {
    commands: COMMANDS_TOKEN,
  },
});
```

### Multi optional dependencies

For `multi` and `optional` dependencies, if provider was not founded, empty `[]` will be resolved, as opposed to `null` for standard tokens.

```ts
import { provide, optional, createToken } from '@tramvai/core';

const COMMANDS_TOKEN = createToken<string>('commands', { multi: true });

const provider = provide({
  provide: 'token',
  useClass: class A {
    // `commands` - empty array
    constructor({ commands }) {
      commands.forEach();
    }
  },
  deps: {
    commands: optional(COMMANDS_TOKEN),
  },
});
```

### Circular dependency

DI does not allow declaring dependencies that depend on each other, for example:

```tsx
import { provide } from '@tramvai/core';
const providers = [
  provide({
    provide: 'A',
    deps: {
      B: 'B',
    },
  }),
  provide({
    provide: 'B',
    deps: {
      A: 'A',
    },
  }),
];
```

In this example, we will not be able to correctly create provider instances and the code will throw an error.

Such providers should reconsider and make a common part in a separate class, and provider and used in conjunction `A` and `B`

## Scope

> option only affects the operation of the container on the server, only one common container running on the client, in which service providers with a different crowd kept together

Allows you to create singleton instances that will be shared between multiple clients. In standard behavior, each declared provider will be automatically deleted and recreated for each new client. This functionality was made in order for us to be able to store both singletons, for example, cache, and various personalized data. For example, user status and personalization.

By default, all providers have the value `Scope.REQUEST`, which means that provider values ​​will be generated for each client. The exception is the `useValue` providers, which behave like a singleton.

## Interface

```tsx
import { provide } from '@tramvai/core';
const provider = provide({
  provide: 'Cache',
  useFactory: Cache,
  scope: Scope.SINGLETON,
});
```

In this case, the `Cache` provider will be registered as a global singleton, since the `scope` parameter was passed and a single instance for all users will be used.

## Tokens

Tokens are used as an identifier for the provider in DI. By the value of the token, the provider is registered and the implementation is searched.

## Interface

```tsx
type token = Token | string;
```

A token can be either a string or a specially created using the `createToken` function into which an interface can be passed. In this case, you can use both a string and createToken at the same time, the main thing is that the identifier is the same

## createToken

```tsx
import { createToken } from '@tinkoff/dippy';
import { provide } from '@tramvai/core';

const loggerToken = createToken<Logger>('logger');

const provider = provide({
  provide: loggerToken,
  useClass: Logger,
});
```

The main difference is that you can pass an implementation interface to createToken, which will then be used for type checking when getting dependencies and creating providers.
