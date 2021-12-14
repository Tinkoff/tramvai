import React from 'react';
import { createApp, createBundle } from '@tramvai/core';
import { SpaRouterModule, useNavigate, useUrl, ROUTER_GUARD_TOKEN } from '@tramvai/module-router';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { modules } from '../common';

const Navigation = ['/', '/not-found'];

function Page() {
  const navigate = useNavigate();
  const { pathname, path } = useUrl();

  return (
    <div>
      <div>Current Path: {path}</div>
      {Navigation.map((p) => {
        if (p !== pathname) {
          return (
            <button type="button" onClick={() => navigate({ url: p })}>
              Navigate to {p}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}

const NotFoundRoot = () => {
  return 'not found root';
};

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
    notFoundRoot: NotFoundRoot,
  },
});

createApp({
  name: 'router-not-found-custom-status',
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'not-found',
        path: '*',
        config: {
          pageComponent: 'notFoundRoot',
        },
      },
    ]),
    ...modules,
  ],
  providers: [
    {
      provide: ROUTER_GUARD_TOKEN,
      multi: true,
      useFactory: ({ responseManager }): typeof ROUTER_GUARD_TOKEN => {
        return async ({ to }) => {
          // watch all navigations, and wait for route with name `not-found`
          if (to && to.name === 'not-found') {
            // set the response status, it will be applied until the end of the response
            responseManager.setStatus(404);
          }
        };
      },
      deps: {
        responseManager: RESPONSE_MANAGER_TOKEN,
      },
    },
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
