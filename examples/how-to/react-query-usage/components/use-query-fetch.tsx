import React from 'react';
import { createAction } from '@tramvai/core';
import { createQuery, useQuery } from '@tramvai/react-query';
import { TINKOFF_API_SERVICE } from '@tramvai/module-api-clients';

const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get<string>('api/base');
    await new Promise((resolve) => setTimeout(resolve, 50));

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});

const action = createAction({
  name: 'action',
  fn: async (context) => {
    const result = await context.executeAction(query.fetchAction());

    console.log('__action__', result);
  },
});

// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}

Component.actions = [action];