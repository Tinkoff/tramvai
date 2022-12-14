import { createQuery, useQuery } from '@tramvai/react-query';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query = createQuery({
  key() {
    return `base/${this.deps.pageService.getCurrentUrl().query.route}`;
  },
  async fn(_) {
    const { apiClient, pageService } = this.deps;
    const { payload } = await apiClient.get<string>('api/by-route', {
      query: {
        route: pageService.getCurrentUrl().query.route ?? 'test',
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
    pageService: PAGE_SERVICE_TOKEN,
  },
});

// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data, isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
