import React from 'react';
import { useSelector } from '@tramvai/state';
import { createBundle } from '@tramvai/core';
import { useRoute } from '@tramvai/module-router';

const WithSelector = () => {
  const route = useSelector('router', ({ router }) => {
    return router.currentRoute;
  });

  if (route.actualPath !== '/useroute/2/') {
    throw new Error('error');
  }

  return <span id="use-route">{route.actualPath}</span>;
};

const PageDefault = () => {
  const route = useRoute();

  return (
    <>
      <h2 id="route-name">{route.name}</h2>
      <div id="page">UseRoute Page Component</div>
      {route.actualPath === '/useroute/2/' && <WithSelector />}
    </>
  );
};

export default createBundle({
  name: 'use-route',
  components: {
    pageDefault: PageDefault,
  },
});
