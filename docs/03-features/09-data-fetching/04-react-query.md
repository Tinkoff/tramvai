---
id: react-query
title: React Query
---

Tramvai provides a complete integration for the awesome [@tanstack/react-query](https://tanstack.com/query/v4/docs/react/overview) library. React Query is a perfect solution for data fetching which can significantly improve DX and UX in your application.

**Currently supported @tanstack/react-query version is ^4.7.1**

## Getting Started

### Installation

You need to install `@tramvai/react-query` and `@tramvai/module-react-query` packages

```bash
tramvai add @tramvai/react-query
tramvai add @tramvai/module-react-query
```

And connect module to the project

```tsx
import { createApp } from '@tramvai/core';
import { ReactQueryModule } from '@tramvai/module-react-query';

createApp({
  name: 'tincoin',
  modules: [...ReactQueryModule],
});
```

### Quick Start

:hourglass: Create a new query:

```ts
import { createQuery } from '@tramvai/react-query';
// @tramvai/module-http-client needed
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

const query = createQuery({
  key: ['repoData'],
  fn() {
    return this.deps.httpClient
      .get<Record<string, any>>('https://api.github.com/repos/tinkoff/tramvai')
      .then(({ payload }) => payload);
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});
```

:hourglass: Use query in component:

```tsx
import { useQuery } from '@tramvai/react-query';

const Example = () => {
  const { isLoading, error, data } = useQuery(query);

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return `An error has occurred: ${error.message}`;
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong> <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
};
```

### Configuration

You can configure options for the [QueryClient](https://tanstack.com/query/v4/docs/react/reference/QueryClient) through the `QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN`, e.g.:

```ts
import { provide } from '@tramvai/core';
import { QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN } from '@tramvai/tokens-react-query';

const provider = provide({
  provide: QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN,
  useValue: {},
});
```

#### Default Options

Here is `QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN` default value:

```ts
const defaults = {
  queries: {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  },
};
```

`refetchOnMount` option is disabled because usually you want to [prefetch](#prefetchaction) query for page, and no needs to fetch it again on mount. Another options are disabled for better network requests control from the application side.

Also, default [retries](https://tanstack.com/query/v4/docs/react/guides/query-retries) is disabled for [actions conditions errors](03-features/09-data-fetching/01-action.md#conditions), because this errors are expected and retrying is meaningless.

## Examples

You can find and run examples in our [repo](https://github.com/Tinkoff/tramvai/-/tree/master/examples/how-to/react-query-usage)

### Basic Query

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: ['base'],
  async fn() {
    await sleep(100);
    return 'Response from API';
  },
});

export function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### Prefetching

:::tip

Always use page component `actions` static property with [prefetchAction](#prefetchaction) to run query for this route at server-side

:::

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: ['base'],
  async fn() {
    await sleep(100);
    return 'Response from API';
  },
});

export default function Page() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}

// highlight-next-line
Page.actions = [query.prefetchAction()];
```

### Dependencies

Queries has full Dependency Injection support, so you can declare dependencies like in [DI providers](concepts/provider.md), in `deps` property. These dependencies will be available in the action `fn` and `key` functions фы `this.deps` property.

:::tip

When you want to prefetch query with specific parameter, the only way to do it right is to get this parameter from DI

:::

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

const query = createQuery({
  key() {
    return `base/${this.deps.pageService.getCurrentUrl().query.route}`;
  },
  async fn() {
    const { apiClient, pageService } = this.deps;

    const { payload } = await httpClient.get<string>('api/by-route', {
      query: {
        route: pageService.getCurrentUrl().query.route ?? 'test',
      },
    });

    return payload;
  },
  deps: {
    httpClient: HTTP_CLIENT,
    pageService: PAGE_SERVICE_TOKEN,
  },
});

// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### Shared Query

If you want to use same query in different components, this queries requests will be deduplicated, and response data will be shared.

```tsx
import { useState, useEffect } from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: ['base'],
  async fn() {
    await sleep(100);
    return 'Response from API';
  },
});

const Child1 = () => {
  const { isLoading, data } = useQuery(query);

  return <div>Child1: {isLoading ? 'loading...' : data}</div>;
};

const Child2 = () => {
  const { isLoading, data } = useQuery(query);

  return <div>Child2: {isLoading ? 'loading...' : data}</div>;
};

export function Component() {

  return (
    <>
      <Child1 />
      <Child2 />
    </>
  );
}
```

### Request parameters

Parameter will be available in `key` and `fn` functions as first argument. You can pass this parameter as second argument of `useQuery` hook.

:::tip

Query keys always should include specific parameters, on which the result of request depends

:::

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: (parameter: string) => ['api-group', parameter],
  async fn(parameter) {
    await sleep(100);
    return `Response ${parameter} from API`;
  },
});

const Child1 = () => {
  const { isLoading, data } = useQuery(query, 'test-1');

  return <div>Child1: {isLoading ? 'loading...' : data}</div>;
};

const Child2 = () => {
  const { isLoading, data } = useQuery(query, 'test-2');

  return <div>Child2: {isLoading ? 'loading...' : data}</div>;
};

export function Component() {
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  );
}
```

### Custom Query options

[Default options](#default-options) will be used for all queries, but you can rewrite them for specific query.

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: 'time',
  async fn() {
    await sleep(100);
    return 'Response from API';
  },
  // default options for this query
  queryOptions: {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
});

export function Component() {
  const { data } = useQuery(
    // the same query with rewritten options
    query.fork({
      refetchInterval: 2000,
      refetchIntervalInBackground: false,
    })
  );

  return <div>{data}</div>;
}
```

### Failed requests

React Query will retry failed requests 3 times by default with exponential backoff. You can change this behavior with `queryOptions` property.

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: 'base',
  async fn() {
    throw Error('Error from API');
  },
  queryOptions: {
    retry: 2,
    retryDelay: 500,
  },
});

export function Component() {
  const { data, isLoading, isError, error } = useQuery(query);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>error: {error!.message}</div>;
  }

  return <div>{data}</div>;
}
```

### Conditions

All [actions retrictions](03-features/09-data-fetching/01-action.md#conditions) are supported:

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query = createQuery({
  key: 'base',
  async fn() {
    await sleep(1000);
    return 'Some slow response from API';
  },
  // highlight-start
  conditions: {
    onlyServer: true,
  },
  // highlight-end
});

export function Component() {
  const { data = 'no-data', isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### Infinite Query

```tsx
import { createInfiniteQuery, useInfiniteQuery } from '@tramvai/react-query';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

interface Response {
  nextPage?: number;
  list: string[];
}

const query = createInfiniteQuery({
  key: 'list',
  async fn(_, start = 0) {
    const { payload } = await this.deps.httpClient.get<Response>('api/list', {
      query: {
        count: 30,
        start,
      },
    });

    return payload;
  },
  getNextPageParam: (page: Response) => {
    return page.nextPage;
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
  infiniteQueryOptions: {},
});

export function Component() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(query);

  if (isLoading) {
    return <>loading...</>;
  }

  return (
    <div>
      <div>
        {data!.pages.map((page) => {
          return page.list.map((entry) => {
            return <div key={entry}>{entry}</div>;
          });
        })}
      </div>
      {hasNextPage && (
        <button type="button" onClick={() => fetchNextPage()}>
          Load more
        </button>
      )}
    </div>
  );
}
```

### Mutation

```tsx
import { createMutation, useMutation } from '@tramvai/react-query';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

const mutation = createMutation({
  key: 'post',
  async fn(_, data: string) {
    const { payload } = await this.deps.httpClient.post('api/post', {
      body: {
        data,
      },
    });

    return payload;
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});

export function Component() {
  const { isLoading, mutate } = useMutation(mutation);

  if (isLoading) {
    return <>loading...</>;
  }

  return (
    <button type="button" onClick={() => mutate('test')}>
      Send data
    </button>
  );
}
```

### Use `@tanstack/react-query` directly

:::caution

Prefer to use methods from the `@tramvai/react-query` as it can work both with the `Query` wrapper and the query options to `@tanstack/react-query` itself

:::

You can get [`QueryClient`](https://tanstack.com/query/v4/docs/reference/QueryClient) from di by token `QUERY_CLIENT_TOKEN` or using method `useQueryClient` in React-components.

To convert wrapped `Query` object to object acceptable by `@tanstack/react-query` use method [raw](#raw) of the `Query` instance.

## API Reference

### `Query`

A wrapper around react-query options with tramvai integration.

#### `fork`

Create new `Query` from an existing query with option to override settings.

```ts
import { createQuery } from '@tramvai/react-query';

const query = createQuery();

const newQuery = query.fork({
  refetchInterval: 2000,
  refetchIntervalInBackground: false,
});
```

#### `prefetchAction`

Return a tramvai action that can be used to prefetch current query

```ts
export default function PageComponent() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}

PageComponent.actions = [query.prefetchAction()];
```

#### `fetchAction`

Return a tramvai action that can be used to fetch current query

```ts
const action = declareAction({
  name: 'action',
  async fn() {
    const result = await this.executeAction(query.fetchAction());

    console.log('__action__', result);
  },
});
```

#### `raw`

Might be used when the raw query options is needed. The result can be passed to the underlying methods of `@tanstack/react-query` lib in cases when `@tramvai/react-query` doesn't provide appropriate wrapper. This method is used internally in the lib to redirect calls to `@tanstack/react-query`.

### `createQuery`

Allows you to create a `Query` object that can later be used in components using `useQuery`. Used to execute single data retrieval requests.

```ts
import { createQuery } from '@tramvai/react-query';

const query = createQuery({
  key: ['base'],
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get('api/base');

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});
```

#### Unique query parameters

To create a generic `query` that takes parameters for a query, you must return a unique `key`, you can read more about this in the official documentation section [Query Keys](https://tanstack.com/query/v4/docs/guides/query-keys)

As a parameter `key` you can use:

- a string, such as `key: 'query-name'`
- an array where any serializable data can be used as elements, for example `key: ['query-name', false, { bar: 'baz }]`
- a function that takes the parameters with which `query` is called and returns a string - `key: (this: { deps }, options) => 'query-name'`. Where through `this.deps` you can get resolved deps for the query.
- a function that accepts parameters, with which `query` is called, and returns an array, where any serializable data can be used as elements - `key: (this: { deps }, options) => ['query-name', options, { bar: 'baz' }]`

```ts
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: (id: number) => ['user', id],
  async fn(id) {
    const { apiClient } = this.deps;
    const { payload } = await apiClient.get(`api/user/${id}`);

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});

export function Component({ id }) {
  const { data, isLoading } = useQuery(query, id);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### `useQuery`

React hook for working with `Query` object

[react-query docs](https://tanstack.com/query/v4/docs/reference/useQuery)

```ts
import { useQuery } from '@tramvai/react-query';

export function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### `useQueries`

React Hook for working with the list of `Query` objects

[react-query docs](https://tanstack.com/query/v4/docs/reference/useQueries)

```ts
import { useQueries } from '@tramvai/react-query';

export function Component() {
  const [{ data: data1, isLoading: isLoading1 }, { data: data2, isLoading: isLoading2 }] =
    useQueries([query1, query2]);

  return (
    <div>
      <div>{isLoading1 ? 'loading1...' : data1}</div>
      <div>{isLoading2 ? 'loading2...' : data2}</div>
    </div>
  );
}
```

### `createInfiniteQuery`

Creates an `InfiniteQuery` object that can later be used in components using `useInfiniteQuery`. It is used to execute queries to obtain a sequence of data that can be loaded as the component runs.

```ts
import { createInfiniteQuery } from '@tramvai/react-query';

const query = createInfiniteQuery({
  key: 'list',
  async fn(_, start = 0) {
    const { apiClient } = this.deps;
    const { payload } = await apiClient.get<Response>('api/list', {
      query: {
        count: 30,
        start,
      },
    });

    return payload;
  },
  getNextPageParam: (page: Response) => {
    return page.nextPage;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});
```

### `useInfiniteQuery`

React hook for working with the `InfiniteQuery` object

[react-query docs](https://tanstack.com/query/v4/docs/reference/useInfiniteQuery)

```ts
import { useInfiniteQuery } from '@tramvai/react-query';

export function Component() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(query);

  if (isLoading) {
    return 'loading...';
  }

  return (
    <div>
      <div>
        {data.pages.map((page) => {
          return page.list.map((entry) => {
            return <div key={entry}>{entry}</div>;
          });
        })}
      </div>
      {hasNextPage && (
        <button type="button" onClick={() => fetchNextPage()}>
          Load more
        </button>
      )}
    </div>
  );
}
```

### `createMutation`

Creates a `Mutation` object that can later be used in components using `useMutation`. Used to send and modify data in the api.

```ts
import { createMutation } from '@tramvai/react-query';

const mutation = createMutation({
  key: 'post',
  async fn(_, data: string) {
    const { apiClient } = this.deps;
    const { payload } = await apiClient.post('api/post', {
      body: {
        data,
      },
    });

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});
```

### `useMutation`

React hook for working with the `Mutation` object

[react-query docs](https://tanstack.com/query/v4/docs/reference/useMutation)

```ts
import { useMutation } from '@tramvai/react-query';

export function Component() {
  const { isLoading, mutate } = useMutation(mutation);

  if (isLoading) {
    return 'loading...';
  }

  return (
    <button type="button" onClick={() => mutate('test')}>
      Send data
    </button>
  );
}
```

##### - [Next: Server-Side Rendering](03-features/010-rendering/01-ssr.md)

##### - [Next: Static Site Generation](03-features/010-rendering/04-ssg.md)
