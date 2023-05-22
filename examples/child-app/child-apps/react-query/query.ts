import { createQuery } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../shared/tokens';

export const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get<string>('api/base');

    await new Promise((resolve) => setTimeout(resolve, 50));

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
});
