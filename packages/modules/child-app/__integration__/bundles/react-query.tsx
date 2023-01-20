import type { PageComponent } from '@tramvai/react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';

const Cmp: PageComponent = () => {
  return (
    <>
      <div>Content from root</div>
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
});
