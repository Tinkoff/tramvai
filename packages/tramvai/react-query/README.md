# React Query

Библиотека для работы с запросами в React-компонентах. Базируется на [react-query](https://react-query.tanstack.com/).

## Explanation

Для работы библиотеки необходимо, чтобы в tramvai-приложение был добавлен модуль [@tramvai/module-react-query](references/modules/react-query.md)

## Api

### createQuery

Позволяет создать объект `Query` который позже можно будет использовать в компонентах с помощью `useQuery`. Используется для выполнения единичных запросов на получение данных.

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

#### Уникальные параметры запроса

Для создания общей `query`, принимающий параметры для запроса, необходимо возвращать уникальный `key`,
подробнее об этом можно почитать в разделе официальной документации [Query Keys](https://react-query.tanstack.com/guides/query-keys)

В качестве параметра `key` можно использовать:

- строку, например `key: 'query-name'`
- массив, где в качестве элементов можно использовать любые сериализуемые данные, например `key: ['query-name', false, { bar: 'baz }]`
- функция, которая принимает параметры, с которыми вызвана `query`, и возвращает строку - `key: (options) => 'query-name'`
- функция, которая принимает параметры, с которыми вызвана `query`, и возвращает массив, где в качестве элементов можно использовать любые сериализуемые данные - `key: (options) => ['query-name', options, { bar: 'baz }]`

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

React-хук для работы с объектом `Query`

[Документация из react-query](https://react-query.tanstack.com/reference/useQuery)

```ts
import { useQuery } from '@tramvai/react-query';

export function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
```

### createInfiniteQuery

Позволяет создать объект `InfiniteQuery` который позже можно будет использовать в компонентах с помощью `useInfiniteQuery`. Используется для выполнения запросов на получение последовательности данных, которые можно подгружать по мере работы компонента.

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

React-хук для работы с объектом `InfiniteQuery`

[Документация из react-query](https://react-query.tanstack.com/reference/useInfiniteQuery)

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

Позволяет создать объект `Mutation` который позже можно будет использовать в компонентах с помощью `useMutation`. Используется для отправки и изменения данных в апи.

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

React-хук для работы с объектом `Mutation`

[Документация из react-query](https://react-query.tanstack.com/reference/useMutation)

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

[Примеры использования @tramvai/react-query](how-to/react-query-usage.md)
