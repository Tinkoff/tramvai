import React from 'react';
import { createApp, createBundle } from '@tramvai/core';
import { SpaRouterModule, useNavigate, useUrl, Link } from '@tramvai/module-router';
import { modules } from '../common';

const Navigation = ['/1/', '/2/', '/3/'];

function Page() {
  // useUrl allows you to get the current url
  const { pathname, path } = useUrl();
  // useNavigate allows you to get a function with which you can call the navigation
  const navigate = useNavigate();
  // useNavigate also allows you to set properties immediately so that the result can be passed immediately as a callback
  const navigateToRoot = useNavigate({ url: '/', query: { a: '1', b: '2' } });

  return (
    <div>
      <div>Current Path: {path}</div>
      <div>
        <button type="button" onClick={navigateToRoot}>
          Navigate to Root
        </button>
        {/* the Link component allows you to create a link with a transition */}
        <Link url="/link/" replace>
          <button type="button">Navigate By Link</button>
        </Link>
      </div>
      {Navigation.map((p, key) => {
        if (p !== pathname) {
          return (
            <button type="button" key={key} onClick={() => navigate({ url: p })}>
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
  name: 'router-navigate',
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'link',
        path: '/link/',
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
    ]),
    ...modules,
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
