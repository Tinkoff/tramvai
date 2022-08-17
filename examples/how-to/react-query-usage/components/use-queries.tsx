import { createQuery, useQueries } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query1 = createQuery({
  key: 'test-1',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get<string>('api/group/test-1');
    await new Promise((resolve) => setTimeout(resolve, 2550));

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
});

const query2 = createQuery({
  key: 'test-2',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get<string>('api/group/test-2');
    await new Promise((resolve) => setTimeout(resolve, 50));

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
});

// eslint-disable-next-line import/no-default-export
export default function Component() {
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
