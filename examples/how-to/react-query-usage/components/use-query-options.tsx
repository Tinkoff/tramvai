import React from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query = createQuery({
  key: 'time',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get<string>('api/time');

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
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
