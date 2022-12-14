import { createQuery, useQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../fakeApiClient';

const query = createQuery({
  key: 'time',
  async fn(_) {
    const { payload } = await this.deps.apiClient.request<string>({
      path: 'api/time',
      cache: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

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
      refetchInterval: 200,
      refetchIntervalInBackground: true,
    })
  );

  return <div>{data}</div>;
}
