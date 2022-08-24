---
id: strong-typing
title: Strong typing
---

## Introduction

`tramvai` has written on TypeScript, and we try to provide first-class developer experience with better typings and automatic type inference.
Nonetheless, perfect typings requires some specific utilities and recipes.

## Dependency Injection

Complete information about `tramvai` DI system you can find in [Concepts section](concepts/di.md).

### Modules

First place, when we need to have a good typings - is list of providers in `tramvai` modules.
This possible when providers wrapped in the `provide` utility:

```ts
import { provide, optional } from '@tramvai/core';

const BOOLEAN_TOKEN = createToken<boolean>('boolean');
const NUMBER_TOKEN = createToken<number>('number');

@Module({
    providers: [
        provide({
            provide: NUMBER_TOKEN,
            // wrong value type, TS compilation error
            useValue: '0',
        }),
        provide({
            provide: BOOLEAN_TOKEN,
            useFactory: (deps) => {
                // deps.int type is number, TS compilation error
                return deps.int === '0';
            },
            deps: {
                int: NUMBER_TOKEN,
            },
        }),
        // example with optional dependency
        provide({
            provide: BOOLEAN_TOKEN,
            useFactory: (deps) => {
                // optional dependency will infer as `number | null`
                return typeof deps.int === 'number' ? deps.int > 0 : false;
            },
            deps: {
                int: optional(NUMBER_TOKEN),
            },
        }),
    ],
})
export class SomeModule {}
```

### Tokens

Always create tokens with specific type:

```ts
const BOOLEAN_TOKEN = createToken<boolean>('boolean');

const API_SERVICE_TOKEN = createToken<ApiService>('boolean');

interface ApiService {
    request<R>(): Promise<R>;
}
```

For `multi` tokens, use the same type as you expect to provide in DI, **not** array of types:

```ts
// good
const LIST_TOKEN = createToken<string>({ name: 'list', multi: true });
```

```ts
// bad
const LIST_TOKEN = createToken<string[]>({ name: 'list', multi: true });
```

When you need infer a token type to **implement** this interface, use `ExtractTokenType` utility:

```ts
import type { ExtractTokenType } from '@tinkoff/dippy';

const BOOLEAN_TOKEN = createToken<boolean>('boolean');
const LIST_TOKEN = createToken<string>({ name: 'list', multi: true });

// boolean
type SomeBoolInterface = ExtractTokenType<typeof BOOLEAN_TOKEN>;

// string
type SomeListInterface = ExtractTokenType<typeof LIST_TOKEN>;
```

When you need infer a token type as dependency, e.g. in **arguments**, use `ExtractDependencyType` utility, this helper return array of types for `multi` tokens, because array of values will return from DI:

```ts
import type { ExtractDependencyType } from '@tinkoff/dippy';

function someFn(deps: {
    bool: ExtractDependencyType<typeof BOOLEAN_TOKEN>,
    list: ExtractDependencyType<typeof LIST_TOKEN>
}) {
    deps.bool; // boolean
    deps.list; // string[]
}
```

### Providers

Sometimes you need to write providers class or factories outside modules - for code maintainability and testing purposes.
For these cases, you will need to manually type values and deps with `ExtractTokenType` and `ExtractDependencyType` utilities.

Factory example with `multi` tokens:

```ts
import type { ExtractTokenType, ExtractDependencyType } from '@tinkoff/dippy';

// import this tokens from some other packages
const FOO_TOKEN = createToken<number>({ name: 'foo', multi: true });
const BAR_TOKEN = createToken<number>({ name: 'bar', multi: true });

// factory deps
type Deps = {
    bar: ExtractDependencyType<typeof BAR_TOKEN>;
}

// factory return type
type Result = ExtractTokenType<typeof FOO_TOKEN>;

export function fooFactory(deps: Deps): Result {
    return [...deps.bar];
}
```

Class example:

```ts
import type { ExtractTokenType, ExtractDependencyType } from '@tinkoff/dippy';

// import this tokens from some other packages
const API_SERVICE_TOKEN = createToken<AbstractApiService>('boolean');
const LIST_TOKEN = createToken<string>({ name: 'list', multi: true });

// class constructor deps
type Deps = {
    list: ExtractDependencyType<typeof LIST_TOKEN>;
}

// class interface
type IApiService = ExtractTokenType<typeof API_SERVICE_TOKEN>;

export class ApiService implements IApiService {
    // reuse Deps interface for simplicity
    private list: Deps['list'];

    constructor(deps: Deps) {
        this.list = deps.list;
    }
}
```

### React components

For React components, you can use hook [useDi](references/tramvai/react.md#usedi).
With this hook, all types will be inferred automatically:

```tsx
import { optional } from '@tramvai/core';
import { useDi } from '@tramvai/react';

const LIST_TOKEN = createToken<string>({ name: 'list', multi: true });

const Component = () => {
    // string[]
    const a = useDi(LIST_TOKEN);
    // string[] | null
    const b = useDi(optional(LIST_TOKEN));
    // string[]
    const { list: c } = useDi({ list: LIST_TOKEN });
    // string[] | null
    const { list: d } = useDi({ list: optional(LIST_TOKEN) });

    return null;
}
```

### Actions

For declaring action use helper function [`declareAction`](references/tramvai/core.md#declareaction). It will infer deps types and function parameters automatically.

```ts
import { declareAction } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';

const innerAction = declareAction({
  name: 'inner-action',
  fn(a: number, b = 5) {
    // typeof LOGGER_TOKEN
    this.deps.logger.info(`got a=${a}`);

    return a + b;
  },
  deps: {
    logger: LOGGER_TOKEN,
  },
});

const action = declareAction({
  name: 'action',
  async fn() {
    // number
    const number1 = await this.executeAction(10);
    // number
    const number2 = await this.executeAction(5, 3);
  },
})
```

## Page and Layout components

PageComponent and LayoutComponent comparing to ordinary React components may specify additional options and should accept limited set of props.

To provide better typings when defining these components use correspond types from [`@tramvai/react` library](references/tramvai/react.md)

```tsx
import { PageComponent, LayoutComponent } from '@tramvai/react';

const Page: PageComponent = () => <h1>Page</h1>;

// props now typed
const Layout: LayoutComponent = ({ Header, Footer, children }) => <div>{children}</div>;

// these properties are now typed
Page.actions = [];
Page.reducers = [];
Page.components = {};

Layout.childApps = [];
```
