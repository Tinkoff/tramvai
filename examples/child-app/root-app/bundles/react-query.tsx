import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { createQuery, useQuery } from '@tramvai/react-query';

const query = createQuery({
  key: 'test',
  async fn() {
    return 'test';
  },
});

const Cmp = () => {
  const result = useQuery(query);

  return (
    <>
      <div>Content from root: {result.data}</div>
      <ChildApp name="react-query" />
    </>
  );
};

Cmp.childApps = [{ name: 'react-query' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'react-query',
  components: {
    pageDefault: Cmp,
  },
  actions: [query.prefetchAction()],
});
