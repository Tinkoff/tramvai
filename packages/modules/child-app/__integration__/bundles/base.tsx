import type { PageComponent } from '@tramvai/react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';

const Cmp: PageComponent = () => {
  return (
    <>
      <div>Content from root</div>
      <ChildApp name="base" />
    </>
  );
};

Cmp.childApps = [{ name: 'base' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'base',
  components: {
    pageDefault: Cmp,
  },
});
