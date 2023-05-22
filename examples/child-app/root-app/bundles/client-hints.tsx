import type { PageComponent } from '@tramvai/react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { LayoutComponent } from '../components/layout';

const Cmp: PageComponent = () => {
  return <ChildApp name="client-hints" />;
};

Cmp.childApps = [{ name: 'client-hints' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'client-hints',
  components: {
    pageDefault: Cmp,
    layoutDefault: LayoutComponent,
  },
});
