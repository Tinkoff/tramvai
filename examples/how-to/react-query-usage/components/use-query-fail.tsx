import { createQuery, useQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get('api/fail');

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
  queryOptions: {
    retryDelay: 500,
  },
});
// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data, isLoading, isError, error } = useQuery(query);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>error: {error!.message}</div>;
  }

  return <div>{data}</div>;
}
