# @tinkoff/dippy

Inversion of Control pattern implementation

## Explanation

`dippy` brings Dependency Injection system to your applications.
Dependency Injection provides a powerful way to make applications modular, flexible and extensible.

### Dependency

Dependency is a peace of code that has a specific purpose - primitive value, object, class instance.

### Container

Container contains information about dependencies, connections between them, and already created instances of dependencies

### Token

Token represents a dependency by unique key and typed interface

### Provider

Provider provides dependency implementation by token, and indicates connections between other dependencies

### Module

Module provides a list of providers and can connect other modules

## Features

- Dynamic initialization
- Replacing implementations
- Multi tokens
- Child containers
- Modules
- Lightweight
- Does not use `reflect-metadata` and decorators
- Circular dependency safe
- Easy to debug

## Usage

### Installation

```bash npm2yarn
npm install @tinkoff/dippy
```

### Quick start

```ts
import {
  createContainer,
  createToken,
  provide,
} from '@tinkoff/dippy';

const COUNTER = createToken<{ value: number }>('counter');
const MULTIPLIER = createToken<{ value: number }>('multiplier');

const providers = [
  provide({
    provide: COUNTER,
    useValue: { value: 2 },
  }),
  provide({
    provide: MULTIPLIER,
    useFactory(deps) {
      return {
        value: deps.counter.value * 2,
      };
    },
    deps: {
      counter: COUNTER,
    },
  }),
];

const container = createContainer(providers);

console.log(container.get(MULTIPLIER)); // 4
```

### API

#### Token

##### createToken(name, options)

`createToken` method creates token - both key and interface for dependency.
`name` argument - string key, name of the dependency.
Optional `options` argument - specific token parameters.

Basic example:

```ts
const FOO_TOKEN = createToken<{ key: string }>('foo');
```

Multi token:

```ts
const FOO_LIST_TOKEN = createToken<{ key: string }>('foo list', { multi: true });
```

##### typeof token

`createToken` returns type of the dependency, e.g.:

```ts
const FOO_TOKEN = createToken<{ key: string }>('foo');

// { key: string }
type InferedFooType = typeof FOO_TOKEN;
```

#### Container

##### createContainer(providers)

`createContainer` method is used to create an instance of the container.
Optional `provider` argument - list of default providers.

Example:

```ts
import { createContainer } from '@tinkoff/dippy';

const container = createContainer([]);
```

##### initContainer({ modules, providers })

`initContainer` method is a wrapper over `createContainer` method and used to create an instance of the container and walk over all modules.

Example:

```ts
import { initContainer } from '@tinkoff/dippy';

const di = initContainer({
  modules: [],
  providers: [],
});
```

##### container.get(token)

`get` method returns resolved dependency instance or resolves this token with his dependencies.

Basic example:

```ts
// string
const foo = container.get(FOO_TOKEN);
```

Optional dependency:

```ts
import { optional } from '@tinkoff/dippy';

// with special `optional` utility
// string | null
const foo1 = container.get(optional(FOO_TOKEN));

// without `optional` utility
// string | null
const foo2 = container.get({ token: FOO_TOKEN, optional: true });
```

Multi token:

```ts
const LIST_TOKEN = createToken<{ key: string }>('list', { multi: true });

// { key: string }[]
const list = container.get(LIST_TOKEN);
```

##### container.register(provider)

`register` method saves provider for token, and can overwrite previous registered provider for the same token.

Value provider:

```ts
container.register({
  provide: FOO_TOKEN,
  useValue: { key: 'a' },
});
```

Multi provider:

```ts
const LIST_TOKEN = createToken<{ key: string }>('list', { multi: true });

container.register({
  provide: LIST_TOKEN,
  multi: true,
  useValue: { key: 'a' },
});

container.register({
  provide: LIST_TOKEN,
  multi: true,
  useValue: [{ key: 'b' }, { key: 'c' }],
});

console.log(container.get(LIST_TOKEN)); // [{ key: 'a' }, { key: 'b' }, { key: 'c' }]
```

Factory provider:

```ts
container.register({
  provide: BAR_TOKEN,
  useFactory(deps) {
    return `${deps.foo} Bar`;
  },
  deps: {
    foo: FOO_TOKEN,
  },
})
```

Class provider:

```ts
class Bar {
  constructor(private foo: string) {}
}

container.register({
  provide: BAR_TOKEN,
  useClass: Bar,
  deps: {
    foo: FOO_TOKEN,
  },
})
```

#### Child container

It is enough to have only one DI container for client SPA applications.
But for server-side applications (SSR or API, no difference), you may need to create unique container for every request into the application.
For this reason, `dippy` provides ability to "fork" root DI container, which allows us to reuse providers from root container, and even providers implementations, if they were registered in `Scope.SINGLETON`.

##### Quick start

```ts
import express from 'express';
import type { Request, Response } from 'express';
import {
  createContainer,
  createToken,
  provide,
  Scope,
} from '@tinkoff/dippy';

const app = express();
const rootDi = createContainer();

const LOGGER = createToken<Console>('logger');
const REQUEST = createToken<Request>('request');
const RESPONSE = createToken<Response>('response');

rootDi.register({
  provide: LOGGER,
  scope: Scope.SINGLETON,
  useFactory() {
    // will be executed only once
    return console;
  },
})

app.get('/', (req, res) => {
  const childDI = createChildContainer(rootDi);
  // the same logger for every request
  const logger = childDI.get(LOGGER);

  // unique req object for request
  childDI.register({
    provide: REQUEST,
    useValue: req,
  });
  // unique res object for request
  childDI.register({
    provide: RESPONSE,
    useValue: res,
  });

  res.send('Hello World!');
});
```

##### Scope

Enum `Scope` has two values - `REQUEST` and `SINGLETON`.
Default value for every provider is `REQUEST`.
If provider from parent DI has scope `REQUEST`, every child DI will resolve own implementation of this provider.
If provider has scope `SINGLETON`, every child DI will reuse the same resolved implementation of this provider from parent DI.

Basic example:

```ts
container.register({
  provide: FOO_TOKEN,
  useValue: { foo: 'bar' },
});
```

Singleton example:

```ts
container.register({
  provide: FOO_TOKEN,
  scope: Scope.SINGLETON,
  useValue: { foo: 'bar' },
});
```

### Module

`Module` - Decorator for configuring and creating a module.

[Read more about modules](concepts/module.md)

#### @Module({ providers, deps, imports })(class)

- `providers` - [Providers](concepts/provider.md), which will be added to the root DI container and become available in other modules
- `deps` - List of dependencies from the DI container, necessary to initialize the module
- `imports` - A list of modules from which providers will be obtained and added to the DI. Allows you to create modules that combine many other modules

#### Usage

```tsx
import { Module, provide } from '@tinkoff/dippy';

@Module({
  providers: [
    provide({
      provide: 'token',
      useValue: 'value-in-token',
    }),
  ],
  deps: {
    logger: 'logger',
  },
  imports: [ModuleLogger],
})
class ModulePubSub {
  constructor({ logger }) {
    logger.info('Module created');
  }
}
```

### declareModule

`declareModule` - factory for configuring and creating a module.

[Read more about modules](concepts/module.md)

#### declareModule({ name, providers, imports, extend })

- `name` - Unique module name
- `providers` - [Providers](concepts/provider.md), which will be added to the root DI container and become available in other modules
- `imports` - A list of modules from which providers will be obtained and added to the DI. Allows you to create modules that combine many other modules
- `extend` - A list of module configuration methods

#### Usage

```tsx
import { declareModule, provide } from '@tinkoff/dippy';

const ModulePubSub = declareModule({
  name: 'PubSub',
  imports: [ModuleLogger],
  providers: [
    provide({
      provide: 'token',
      useValue: 'value-in-token',
    }),
  ],
  extend: {
    forRoot(tokenValue: string) {
      return [
        provide({
          provide: 'token',
          useValue: tokenValue,
        }),
      ];
    },
  },
});

// use ModulePubSub or ModulePubSub.forRoot('new value')
```
