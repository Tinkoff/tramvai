import React, { useState, useEffect } from 'react';
import { createQuery, useQuery } from '@tramvai/react-query';
import { TINKOFF_API_SERVICE } from '@tramvai/module-api-clients';

const query = createQuery({
  key: 'base',
  fn: async (_, { apiClient }) => {
    console.log('request');
    const { payload } = await apiClient.get('api/base');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return payload;
  },
  deps: {
    apiClient: TINKOFF_API_SERVICE,
  },
});

const Child1 = () => {
  const { isLoading, data } = useQuery(query);

  return <div>Child1: {isLoading ? 'loading...' : data}</div>;
};

const Child2 = () => {
  const { isLoading, data } = useQuery(query);

  return <div>Child2: {isLoading ? 'loading...' : data}</div>;
};

const Child3 = () => {
  const { isLoading, data } = useQuery(query);

  return <div>Child3: {isLoading ? 'loading...' : data}</div>;
};

// eslint-disable-next-line import/no-default-export
export default function Component() {
  const [child2, setChild2Visible] = useState(false);
  const [child3, setChild3Visible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setChild2Visible(true);
    }, 3000);

    setTimeout(() => {
      setChild3Visible(true);
    }, 7000);
  }, []);

  return (
    <>
      <Child1 />
      {child2 && <Child2 />}
      {child3 && <Child3 />}
    </>
  );
}
