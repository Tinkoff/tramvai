import React from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';
import { TINKOFF_API_SERVICE } from '@tramvai/module-api-clients';

const query = createQuery({
  key: 'time',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get('api/time');

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
  queryOptions: {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
});
// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data } = useQuery(
    query.fork({
      refetchInterval: 2000,
      refetchIntervalInBackground: false,
    })
  );

  return <div>{data}</div>;
}
