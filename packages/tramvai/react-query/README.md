---
title: '@tramvai/react-query'
sidebar_position: 5
---

# React Query

A library for handling requests in React components. Based on [@tanstack/react-query](https://tanstack.com/query/v4/).

## Explanation

For the library to work, the module [@tramvai/module-react-query](references/modules/react-query.md) must be added to the tramvai application

## Api

### Query

A wrapper around react-query options with tramvai integration.

#### fork

Create new `Query` from an existing query with option to override settings.

```ts
import { createQuery } from '@tramvai/react-query';

const query = createQuery();
const newQuery = query.fork({
  refetchInterval: 2000,
  refetchIntervalInBackground: false,
});
```

#### prefetchAction

Return a tramvai action that can be used to prefetch current query

```ts
export default function PageComponent() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}

Component.actions = [query.prefetchAction()];
```

#### fetchAction

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

#### raw

Might be used when the raw query options is needed. The result can be passed to the underlying methods of `react-query` lib in cases when `@tramvai/react-query` doesn't provide appropriate wrapper. This method is used internally in the lib to redirect calls to `react-query`.

### createQuery

Allows you to create a `Query` object that can later be used in components using `useQuery`. Used to execute single data retrieval requests.

```ts
import { createQuery } from '@tramvai/react-query';

const query = createQuery({
  key: 'base',
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
- a function that takes the parameters with which `query` is called and returns a string - `key: (options) => 'query-name'`
- a function that accepts parameters, with which `query` is called, and returns an array, where any serializable data can be used as elements - `key: (options) => ['query-name', options, { bar: 'baz' }]`

```ts
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: (id: number) => ['user', id],
  fn: async (id, { apiClient }) => {
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

### useQuery

React hook for working with `Query` object

[react-query docs](https://tanstack.com/query/v4/docs/reference/useQuery)

```ts
import { useQuery } from '@tramvai/react-query';

export function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### useQueries

React Hook for working with the list of `Query` objects

[react-query docs](https://tanstack.com/query/v4/docs/reference/useQueries)

```ts
import { useQueries } from '@tramvai/react-query';

export function Component() {
  const [
    { data: data1, isLoading: isLoading1 },
    { data: data2, isLoading: isLoading2 },
  ] = useQueries([query1, query2]);

  return (
    <div>
      <div>{isLoading1 ? 'loading1...' : data1}</div>
      <div>{isLoading2 ? 'loading2...' : data2}</div>
    </div>
  );
}
```

### createInfiniteQuery

Creates an `InfiniteQuery` object that can later be used in components using `useInfiniteQuery`. It is used to execute queries to obtain a sequence of data that can be loaded as the component runs.

```ts
import { createInfiniteQuery } from '@tramvai/react-query';

const query = createInfiniteQuery({
  key: 'list',
  fn: async (_, start = 0, { apiClient }) => {
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

### useInfiniteQuery

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

### createMutation

Creates a `Mutation` object that can later be used in components using `useMutation`. Used to send and modify data in the api.

```ts
import { createMutation } from '@tramvai/react-query';

const mutation = createMutation({
  key: 'post',
  fn: async (_, data: string, { apiClient }) => {
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

### useMutation

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

## How-to

[Examples of using @tramvai/react-query](how-to/react-query-usage.md)

### Use `react-query` directly

:::warning Prefer to use methods from the `@tramvai/react-query` as it is can work both with the `Query` wrapper and the query options to `react-query` itself :::

You can get [`QueryClient`](https://tanstack.com/query/v4/docs/reference/QueryClient) from di by token `QUERY_CLIENT_TOKEN` or using method `useQueryClient` in React-components.

To convert wrapped `Query` object to object acceptable by `react-query` use method [raw](#raw) of the `Query` instance.
