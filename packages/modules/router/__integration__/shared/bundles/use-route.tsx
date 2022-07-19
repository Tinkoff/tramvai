import { useState } from 'react';
import { useStoreSelector } from '@tramvai/state';
import { createBundle } from '@tramvai/core';
import type { Route } from '@tinkoff/router';
import { useRoute, RouterStore } from '@tramvai/module-router';

const WithSelector = ({ routeFromParent }: { routeFromParent: Route }) => {
  const [mismatchedRoutes, setMismatchedRoutes] = useState(false);
  const routeFromStore = useStoreSelector(RouterStore, (state) => state.currentRoute);

  if (!mismatchedRoutes && routeFromParent !== routeFromStore) {
    setMismatchedRoutes(true);
  }

  if (mismatchedRoutes) {
    return <span>Error: Route data from hook and from store are mismatched</span>;
  }

  return <span id="use-route">{routeFromStore.actualPath}</span>;
};

const PageDefault = () => {
  const route = useRoute();

  return (
    <>
      <h2 id="route-name">{route.name}</h2>
      <div id="page">UseRoute Page Component</div>
      <WithSelector routeFromParent={route} />
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'use-route',
  components: {
    pageDefault: PageDefault,
  },
});
