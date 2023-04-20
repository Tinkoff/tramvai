---
id: data-fetching
title: Data Fetching
---

## Explanation

Standard way to fetch data in Child App is to use `tramvai` [HTTP Clients](03-features/09-data-fetching/02-http-client.md) and [Actions](03-features/09-data-fetching/01-action.md) with [Stores](03-features/015-child-app/05-state-management.md).

### HTTP Client

You have a two main options to use `tramvai` HTTP clients:
- Get already created clients from Root App
- Create your own HTTP client in Child App

We recommend to use first approach with already created clients from Root App, because it opens a lot of optimizations:
- Child App bundle is smaller because doesn't contain HTTP client code
- Cache for same requests will be shared between all Child Apps
- The same Child App requests will be deduplicated

`HTTP_CLIENT` and all your custom HTTP clients will be available in Child App DI automatically, and you need only to use appropriate tokens to get it.

:::info

`@tramvai/module-http-client` need to be connected in Root App, if we want to use `HTTP_CLIENT` token in Child App

:::

### Actions

[Actions](03-features/09-data-fetching/01-action.md) is the standard way to perform any side-effects in the Child App, and works exactly the same as in Root App.

All declared in `createChildApp` actions will be executed in parallel on the different stages of [Child App lifecycle](03-features/015-child-app/06-lifecycle.md).

## Usage

### Installation

First, you need to install `@tramvai/module-common` module and `@tramvai/tokens-http-client` in your Child App:

```bash
npx tramvai add @tramvai/module-common
npx tramvai add @tramvai/tokens-http-client
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

### Make HTTP request

:::tip

Perfect alternative to Action and State combination is awesome [React Query](03-features/015-child-app/012-advanced/03-react-query.md) library

:::

:hourglass: At first, we need to create a new [Store](03-features/015-child-app/05-state-management.md) for request data and execution state, for example with `data`, `error` and `loading` states:

```ts
import { createReducer, createEvent } from '@tramvai/state';

export const dataRequested = createEvent('requested');
export const dataLoaded = createEvent<Data>('loaded');
export const dataFailed = createEvent<Error>('failed');

type State = {
  data: Data | null;
  error: Error | null;
  loading: boolean;
};

const initialState: State = { data: null, error: null, loading: false };

export const SomeDataStore = createReducer('some-data', initialState)
  .on(dataRequested, (state) => ({ data: null, error: null, loading: true }))
  .on(dataLoaded, (state, data) => ({ data, error: null, loading: false }))
  .on(dataFailed, (state, error) => ({ data: null, error, loading: false }));
```

:hourglass: Then, we need to create a new Action with HTTP call, and save all information to our new store:

```ts
import { declareAction } from '@tramvai/core';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';
import { dataRequested, dataLoaded, dataFailed } from '../stores/some-data';

export const fetchSomeDataAction = declareAction({
  name: 'fetch-some-data',
  async fn() {
    this.dispatch(dataRequested());

    try {
      const { payload } = this.deps.httpClient.get<Data>('https://api.get/some-data/');

      this.dispatch(dataLoaded(payload));
    } catch (error) {
      this.dispatch(dataFailed(error));
    }
  },
  deps: {
    // this dependency will be resolved from Root App
    httpClient: HTTP_CLIENT,
  },
});
```

:hourglass: Then, action need to be declared in `createChildApp` function:

```ts
import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { RootCmp } from './components/root';
  // highlight-next-line
import { fetchSomeDataAction } from './actions/some-data';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  modules: [CommonChildAppModule],
  providers: [],
  // highlight-next-line
  actions: [fetchSomeDataAction],
});
```

:hourglass: At last, we can subscribe to this data in our [UI component](03-features/015-child-app/03-ui-component.md):

```tsx title="components/root.tsx"
import { useStore } from '@tramvai/state';
import { SomeDataStore } from '../stores/some-data';

export const RootCmp = () => {
  const { data, error, loading } = useStore(SomeDataStore);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return <div>Result: {data}</div>;
};
```

This action will be executed before Root App will be render our Child App. If Child App will be [preloaded](03-features/015-child-app/010-connect.md#preloading), in success case, this action will be executed on the server side, and user never see loading state in the browser.
