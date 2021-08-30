import React from 'react';
import { useRoute, useUrl } from '@tramvai/module-router';
import { pageActions } from '../../actions/page';

export const PageDefault = () => {
  const route = useRoute();
  const { path } = useUrl();

  return (
    <>
      <h2 id="route-name">{route.name}</h2>
      <div id="page">Lazy Page Component</div>
      <div id="url-path">{path}</div>
    </>
  );
};

PageDefault.actions = pageActions;

export default PageDefault;
