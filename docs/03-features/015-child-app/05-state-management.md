---
id: state-management
title: Managing State
---

## Explanation

All [@tramvai/state](03-features/08-state-management.md) features are available in Child App with connected `CommonChildAppModule` module.

State Management is almost completely isolated from Root App and other of Child Apps. Every microfrontend can register its own stores and actions.

In general, State Management usage is completely the same as in usual tramvai applications.

## Usage

### Installation

First, you need to install `@tramvai/module-common` module and `@tramvai/state` library in your Child App:

```bash
npx tramvai add @tramvai/module-common
npx tramvai add @tramvai/state
```

Then, connect `CommonChildAppModule` from this module in your `createChildApp` function:

```ts
import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { RootCmp } from './components/root';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  modules: [CommonChildAppModule],
  providers: [],
});
```

### Create store

For example, let's create a simple counter store:

```ts title="stores/counter.ts"
import { createReducer, createEvent } from '@tramvai/state';

export const increment = createEvent('increment');

export const CounterStore = createReducer('counter', 0)
  .on(increment, (state, payload) => state + 1);
```

### Connect store

Now, let's connect this store to our Child App through `COMBINE_REDUCERS` token:

```ts
import { provide } from '@tramvai/core';
import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule, COMBINE_REDUCERS } from '@tramvai/module-common';
import { RootCmp } from './components/root';
import { CounterStore } from './stores/counter';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  modules: [CommonChildAppModule],
  providers: [
    // highlight-start
    provide({
      provide: COMBINE_REDUCERS,
      multi: true,
      useValue: [testStore],
    }),
    // highlight-end
  ],
});
```

### Read and update store

Simplest way to read data from store is to use [useStore](03-features/08-state-management.md#usestore) hook. For event dispatching, you need to get Store instance from DI with [useDi](references/tramvai/react.md#usedi) hook and `STORE_TOKEN`:

```tsx title="components/root.tsx"
import { useDi } from '@tramvai/react';
import { useStore } from '@tramvai/state';
import { STORE_TOKEN } from '@tramvai/module-common';
import { CounterStore, increment, decrement } from '../stores/counter';

export const RootCmp = () => {
  // get Store instance from DI
  const store = useDi(STORE_TOKEN);
  // subscribe to counter reducer state
  const counter = useStore(CounterStore);

  // bind events to dispatch
  const handleIncrement = () => store.dispatch(increment());

  return (
    <>
      <h1>Count is: {counter}</h1>
      <button onClick={handleIncrement}>increment</button>
    </>
  );
};
```

## How to

### How to subscribe to Root App store?

By default, Child App cannot read data from Root App stores, but the you can specify the set of Root App stores that might be used inside Child App.

It may be done using `CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN` token. This token defines the list of allowed Root App store names that might be used inside Child App.

:::warning

This token is considered undesirable to use as it leads to high coupling with stores from Root App and this way stores in Root App might not change their public interface. But, in most cases, changes in stores ignore breaking change tracking and may breaks backward-compatibility. So **do not use this token if you can**, and if you should - use as little as possible from Root App and provide some fallback in case of wrong data.

:::

For example, let's subscribe to [MediaStore from @tramvai/module-client-hints](references/modules/client-hints.md#media):

1. Specify stores that might be used inside Child App

  ```ts
  import { createChildApp, CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN } from '@tramvai/child-app-core';
  import { CommonChildAppModule } from '@tramvai/module-common';
  import { MediaStore } from '@tramvai/module-client-hints';
  import { RootCmp } from './components/root';

  // eslint-disable-next-line import/no-default-export
  export default createChildApp({
    name: 'fancy-child',
    render: RootCmp,
    // highlight-next-line
    modules: [CommonChildAppModule],
    providers: [
      provide({
        provide: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
        multi: true,
        // also you can use store string key, "media" for MediaStore
        useValue: [MediaStore],
      }),
    ],
  });
  ```

2. Use the specified Root App stores the same way as usual stores

  ```tsx
  import React from 'react';
  import { useStore } from '@tramvai/state';
  import { MediaStore } from '@tramvai/module-client-hints';

  export const StateCmp = () => {
    const media = useStore(MediaStore);

    return <div>Supposed screen size: {media.width}x{media.height}</div>;
  };
  ```
