import React from 'react';
import { createMutation, useMutation } from '@tramvai/react-query';
import { FAKE_API_CLIENT } from '../../fakeApiClient';

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
    apiClient: FAKE_API_CLIENT,
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
