import React from 'react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { LayoutComponent } from '../components/layout';

const Cmp = () => {
  return (
    <>
      <div>Content from root</div>
      <ChildApp name="router" />
    </>
  );
};

Cmp.childApps = [{ name: 'router' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'router',
  components: {
    pageDefault: Cmp,
    layoutDefault: LayoutComponent,
  },
});
