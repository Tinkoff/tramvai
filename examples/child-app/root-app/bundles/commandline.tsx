import type { PageComponent } from '@tramvai/react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { LayoutComponent } from '../components/layout';

const Cmp: PageComponent = () => {
  return (
    <>
      <div>Content from root</div>
      <ChildApp name="commandline" />
    </>
  );
};

Cmp.childApps = [{ name: 'commandline' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'commandline',
  components: {
    pageDefault: Cmp,
    layoutDefault: LayoutComponent,
  },
});
