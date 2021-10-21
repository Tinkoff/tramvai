import React from 'react';
import { createApp, createBundle } from '@tramvai/core';
import { useSelector } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { SpaRouterModule, ROUTES_TOKEN, PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

import { modules } from '../common';

const Navigation = ['/1/', '/2/', '/3/'];

function Page() {
  // useSelector to get the current route
  // store 'router' is provided by RouterModule
  const state = useSelector('router', (x) => x.router);
  // pageService - a wrapper for working with a router, you can get various properties and initiate a transition
  // but through useDi you cannot subscribe to data changes inside services, so to subscribe to route changes
  // used by useSelector above
  const pageService = useDi(PAGE_SERVICE_TOKEN);
  const { pathname, path } = state.currentUrl;

  return (
    <div>
      <div>Current Path: {path}</div>
      {Navigation.map((p) => {
        if (p !== pathname) {
          return (
            <button type="button" onClick={() => pageService.navigate({ url: p })}>
              Navigate to {p}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
  },
});

createApp({
  name: 'route-static-routes',
  modules: [
    // the static forRoot method allows you to define static routes in the application -
    // these routes are always available and the config for them is not loaded from the admin panel, but are set right there
    SpaRouterModule.forRoot([
      {
        name: '1',
        path: '/1/',
      },
      {
        name: '2',
        path: '/2/',
      },
    ]),
    ...modules,
  ],
  providers: [
    {
      // you can also set static routes by a separate provider
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: [
        {
          name: '3',
          path: '/3/',
        },
      ],
    },
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
