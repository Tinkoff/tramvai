import { createQuery, useQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../fakeApiClient';

const query = createQuery({
  key: 'auth',
  async fn(_) {
    const { payload } = await this.deps.apiClient.get('api/auth');

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
  conditions: {
    onlyServer: true,
  },
});
// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data = 'no-data', isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
