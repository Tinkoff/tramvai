import React from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';
import { TAPI_ROLES } from '@tinkoff/roles';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get('api/auth');

    return payload;
  },
  deps: {
    apiClient: FAKE_API_CLIENT,
  },
  conditions: {
    requiredCoreRoles: [TAPI_ROLES.REGISTERED],
  },
});
// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { data = 'no-data', isLoading } = useQuery(query);

  return <div>{isLoading ? 'loading...' : data}</div>;
}
