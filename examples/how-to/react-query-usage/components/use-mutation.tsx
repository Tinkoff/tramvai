import React from 'react';
import { createMutation, useMutation } from '@tramvai/react-query';
import { TINKOFF_API_SERVICE } from '@tramvai/module-api-clients';

const mutation = createMutation({
  key: 'post',
  fn: async (_, data: string, { apiClient }) => {
    const { payload } = await apiClient.post('api/post', {
      body: {
        data,
      },
    });

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});
// eslint-disable-next-line import/no-default-export
export default function Component() {
  const { isLoading, mutate } = useMutation(mutation);

  if (isLoading) {
    return <>loading...</>;
  }

  return (
    <button type="button" onClick={() => mutate('test')}>
      Send data
    </button>
  );
}
