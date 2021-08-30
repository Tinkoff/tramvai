import React from 'react';
import { createBundle } from '@tramvai/core';
import { useRoute, useUrl } from '@tramvai/module-router';
import { pageActions } from '../actions/page';
import { bundleActions } from '../actions/bundle';

const layoutDefault = ({ children }) => (
  <>
    <h3 id="layout">Default Layout</h3>
    <div>{children}</div>
  </>
);

export const PageDefault = () => {
  const route = useRoute();
  const { path } = useUrl();

  return (
    <>
      <h2 id="route-name">{route.name}</h2>
      <div id="page">Default Page Component</div>
      <div id="url-path">{path}</div>
    </>
  );
};
const pageWithActions = Object.assign(() => 'pageWithActions', { actions: pageActions });

const notFound = () => 'not found';

export default createBundle({
  name: 'mainDefault',
  actions: bundleActions,
  components: {
    pageDefault: PageDefault,
    pageWithActions,
    notFound,
    layoutDefault,
  },
});
