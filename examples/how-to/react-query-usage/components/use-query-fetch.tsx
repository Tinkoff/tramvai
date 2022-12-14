import { declareAction } from '@tramvai/core';
import { createQuery, useQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query = createQuery({
  key: 'base',
  async fn(_) {
    const { payload } = await this.deps.apiClient.get<string>('api/base');
    await new Promise((resolve) => setTimeout(resolve, 50));

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
});

const action = declareAction({
  name: 'action',
  async fn() {
    const result = await this.executeAction(query.fetchAction());

    console.log('__action__', result);
  },
});

// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}

Component.actions = [action];
