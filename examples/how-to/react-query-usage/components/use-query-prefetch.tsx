import React from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';
import { TINKOFF_API_SERVICE } from '@tramvai/module-api-clients';

const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get('api/base');
    await new Promise((resolve) => setTimeout(resolve, 50));

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});

// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}

Component.actions = [query.prefetchAction()];
