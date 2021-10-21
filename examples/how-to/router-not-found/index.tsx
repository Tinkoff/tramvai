import React from 'react';
import { createApp, createBundle } from '@tramvai/core';
import { SpaRouterModule, useNavigate, useUrl } from '@tramvai/module-router';
import { modules } from '../common';

const Navigation = [
  '/1/',
  '/2/',
  '/3/',
  '/not-found',
  '/child/1/',
  '/child/2/',
  '/child/3/',
  '/child/not-found',
];

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

// Defining a separate page
const NotFoundRoot = () => {
  return 'not found root';
};

const NotFoundChild = () => {
  return 'not found child';
};

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
    notFoundRoot: NotFoundRoot,
    notFoundChild: NotFoundChild,
  },
});

createApp({
  name: 'route-navigate',
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: '1',
        path: '/1/',
      },
      {
        name: '2',
        path: '/2/',
      },
      {
        name: '3',
        path: '/3/',
      },
      {
        name: 'child-1',
        path: '/child/1/',
      },
      {
        name: 'child-2',
        path: '/child/2/',
      },
      {
        name: 'child-1',
        path: '/child/3/',
      },
      {
        name: 'not-found-root',
        path: '*',
        config: {
          pageComponent: 'notFoundRoot',
        },
      },
      {
        name: 'not-found-child',
        path: '/child/*',
        config: {
          pageComponent: 'notFoundChild',
        },
      },
    ]),
    ...modules,
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
