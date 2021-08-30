import React from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';
import { TINKOFF_API_SERVICE } from '@tramvai/module-api-clients';
import { TAPI_ROLES } from '@tinkoff/roles';

const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    const { payload } = await apiClient.get('api/auth');

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
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
