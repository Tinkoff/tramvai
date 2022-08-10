---
id: di
title: Dependency Injection
sidebar_position: 2
---

Tramvai is based on a `DI` system that contains information about dependencies, connections between them, and already created instances of dependencies.

## Concepts

- [Provider](concepts/provider.md) - Token implementation in DI
- [Tokens](concepts/provider.md) - provider identifier in DI system and at the same time its interface
- Container - storage with all providers and their implementations

## Features

### Dynamic Initialization

Providers are initialized only if the code got an instance using the `get` method from the di container or if the provider was specified as a` deps` dependency on `module`. In other cases, the provider will not be created and initialized.

This feature allows us to register providers in any order and replace implementations.

### Replacing implementations

In some cases, the basic implementation of the functionality may not be suitable for us, and to solve this problem, we can override the implementation of the providers. For example, the current logger from the common-module is not suitable for us and we want to replace it, for this we need to drop a new implementation for the token into the providers.

```tsx
import { provide } from '@tramvai/core';
createApp({
  modules: [CommonModule],
  providers: [
    provide({
      provide: LOGGER_TOKEN,
      useValue: console,
    }),
  ],
});
```

After that, we will replace the implementation of` LOGGER_TOKEN`, which was declared in `CommonModule`, with a native object `console`

### Checking the availability of the implementation of all dependencies

When initializing the provider, the availability of all dependencies is automatically checked if no dependency was found and the provider is not optional, an exception is thrown in development mode.

## Using DI

### In modules

Passing an array to the `providers` parameter that will be added when the application is initialized in DI. [More about modules](concepts/module.md)

```tsx
@Module({
  providers: [
    // ...
  ],
})
export class MyModule {}
```

### In createApp

You can pass the `providers` array to [createApp](references/tramvai/core.md#createApp), which will have the highest priority and will overwrite the implementations of the modules and core interfaces:

```tsx
createApp({
  providers: [
    // ...
  ],
});
```

### In actions

To get provider implementations, you can pass a `deps` object when creating an action:

```tsx
declareAction({
  name: 'action',
  fn() {
    this.deps.logger.error('ERROR');
  },
  deps: {
    logger: 'logger',
  },
});
```

## Container A

container that stores a list of registered providers in the application, as well as instances of provider implementations that have already been created.

### Root container

Top-level global container that contains all registered providers and global singletons that live as long as the application lives.

### Container is a child

A DI instance created for each client (user who sent a request to the server) that inherits from the container root. But it allows you to create and store your own class instances. Which can contain private information about the client and at the same time, this information will not leak to other clients, for example, a link to the actual Request object.

Consumer di is created and lives on while we respond to the client. As soon as we answered, consumer di is deleted and all private information is cleared. This does not require manual cleaning and deletion of the di container or its dependencies. This work is based on the fact that when responding to the client, the reference to the context and the DI container is lost. Then the GC will delete everything from memory.

## Additional material

- Video explaining why DI is needed and why you should use it [Part 1](https://www.youtube.com/watch?v=ETyltCwtQHs) [Part 2](https://www.youtube.com/watch?v=RwLWYB9C2Tc)
- Release of the devshakhta which is dedicated to DI and why is it needed https://www.youtube.com/watch?v=3NgWwzwDeTQ
