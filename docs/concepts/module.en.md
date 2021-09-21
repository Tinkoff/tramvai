---
id: module
title: Module
---

Modules are the implementation of some limited functionality of the application using the DI system and providers.

## Module life cycle

### Initializing the application

When creating an application, all declared [providers](concepts/provider.md) are processed, which will fall into the general [DI](concepts/di.md) container.

### Handling customer requests

The module is instantiated once on the server (and used for all clients), after initializing the application, and once in the browser, after loading the page and initializing the client side. These instances contain instances of the classes that were passed to `deps` and will be passed to the module's constructor:

```tsx
import { Module } from '@tramvai/core';

@Module({
  providers: [],
  deps: {
    log: 'log',
  },
})
class TestModule {
  constructor({ log }) {
    log.info('TestModule created');
  }
}
```

## Example module

The main functionality of the module is in the `providers` list. Each provider either adds new functionality, for example, makes available in all other modules the constant value `New` under the key `Token`:

```tsx
import { Module, provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: 'Token',
      useValue: 'New',
    }),
  ],
})
class TestModule {}
```

Or it uses tokens from other modules, for example, adding a new environment parameter via the `ENV_USED_TOKEN` token, which will be processed by the EnvModule:

```tsx
import { Module, provide } from '@tramvai/core';
import { ENV_USED_TOKEN } from '@tramvai/module-common';

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'ENV_VARIABLE',
          value: 'New',
          optional: true,
        },
      ],
    }),
  ],
})
class TestModule {}
```

## Import in module third party modules

Modules can be imported internally by providers of third-party modules. Thus, allowing you to build a chain of interconnected modules.

Code example

```tsx
import { Module } from '@tramvai/core';
import { LogModule } from '@tramvai/module-log';

@Module({
  providers: [],
  imports: [LogModule],
})
class TestModule {}
```

In this case, when initializing TestModule, the providers from the ModuleLogger module and nested imports, if present, will be initialized beforehand.

## Dynamic modules

Modules can be configured in two ways, and both methods can be used simultaneously:

- passing parameters to `module`
- return parameters in the static method `forRoot`

An example of a dynamic module, in which we will add dependencies `metaGenerate` to the DI in the first way and `meta-list` in the second, and one of them depends on the other:

```tsx
import { Module, provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: 'metaGenerate',
      useClass: class MetaGenerate {},
      deps: {
        list: 'meta-list',
      },
    }),
  ],
})
export class SeoModule {
  static forRoot({ metaList }: { metaList?: string[] }) {
    if (metaList) {
      return {
        mainModule: SeoModule,
        providers: [
          provide({
            provide: 'meta-list',
            useValue: metaList,
          }),
        ],
      };
    }
  }
}
```

A static method must return an object with an interface:

```tsx
type staticModule = {
  mainModule: Module; // Link to the main module, from which we will extract all the basic information
  providers: Provider []; // Providers to be added to DI
};
```

Now this module contains a static method `forRoot` which adds additional `providers` to the standard `SeoModule` module. Without this construct, we would need to explicitly write providers in the application. All data that has been added to the `SeoModule` will be inherited and expanded.

Now we can call our static method in the application or in other modules. And the result of execution of `forRoot` will be added to` DI`

```tsx
import { Module } from '@tramvai/core';
import { SeoModule } from './SeoModule';
import { metaFromConfig } from './metaFromConfig';

@Module({
  imports: [SeoModule.forRoot([metaFromConfig])],
})
export class ApplicationModule {}
```

It should be borne in mind that the `forRoot` construction should only simplify the use of the module and we should also maintain the functionality of the module through the usual configuration of `providers`

## Recommendations for modules

### Low cohesion

It is advisable to build modules so that they do not directly depend on other modules. Coupling only needs to be interface-based and replaceable. Otherwise, it will not be possible to simply replace modules and refactor.

### Small size

The larger the module, the more code it contains inside and the more potentially it has connections and reasons for changes.

For this reason, the module will be more difficult to change and there will be a greater chance of breaking functionality when changed.

It is desirable that the modules implement some small part of the functionality.

### Optional dependencies / configuration

It is convenient to use the module if it does not require any configuration and works normally by default. But, if it is clear that for some applications and cases additional behavior setting will be needed, then it is advisable to use optional dependencies that can be defined in the application.

It is worth marking non-critical functionality with optional dependencies, which the module does not necessarily need. So that you can not implement interfaces and throw out some of the logic. For example, logging

```tsx
// @todo example of optional dependency
```

### Debugging Modules

It is recommended to specify in the module documentation the unique identifier / namespace of the logger, which is used in this module. Example module id for `@tramvai/module-server`:

```tsx
const log = logger ('server'); // get a logger instance by LOGGER_TOKEN token
```

## Additional links

- About [DI container](concepts/di.md)
- About [providers](concepts/provider.md)
