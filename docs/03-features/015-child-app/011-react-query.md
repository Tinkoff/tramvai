---
id: react-query
title: React Query
---

React Query integration works the same way as [Root App integration](03-features/09-data-fetching/04-react-query.md)

## Installation

First, you need to install `@tramvai/module-react-query` module in your Child App:

```bash
npx tramvai add @tramvai/module-react-query
```

Then, connect `ReactQueryModule` from this module in your `createChildApp` function:

```ts
import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { RootCmp } from './components/root';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  modules: [CommonChildAppModule, ReactQueryModule],
  providers: [],
});
```

## Usage

React Query usage consists of 3 steps:
- creation
- usage in component
- prefetching with Child App preloading

### Create query

```ts
import { createQuery } from '@tramvai/react-query';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

export const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get<string>('api/example');

    return payload;
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});
```

### Use query

```tsx title="components/root.tsx"
import { useQuery } from '@tramvai/react-query';
import { query } from './query';

export const RootCmp = () => {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
};
```

### Prefetch query

```ts
import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { RootCmp } from './components/root';
import { query } from './query';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  modules: [CommonChildAppModule, ReactQueryModule],
  providers: [],
  // highlight-next-line
  actions: [query.prefetchAction()],
});
```

## Tips

### Bundle Size

For example, you will use React Query in Root App and few Child Apps in same page. In this case, total JS amount will be increased significantly.

To avoid this, you can share React Query libraries through [Module Federation](03-features/015-child-app/014-module-federation.md)
