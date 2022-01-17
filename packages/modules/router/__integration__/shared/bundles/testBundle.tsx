import React from 'react';
import { createBundle } from '@tramvai/core';
import { useRoute } from '@tramvai/module-router';
import { bundleActions } from '../actions/bundle';

const layoutDefault = ({ children }: { children: React.ElementType }) => (
  <>
    <h3 id="layout">Test Layout</h3>
    <div>{children}</div>
  </>
);

export const PageDefault = () => {
  const route = useRoute();

  return (
    <>
      <h2 id="route-name">{route.name}</h2>
      <div id="page">Test Page Component</div>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'test',
  actions: bundleActions,
  components: {
    pageDefault: PageDefault,
    layoutDefault,
  },
});
