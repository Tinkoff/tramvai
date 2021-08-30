import React from 'react';
import { createApp, createBundle } from '@tramvai/core';
import { SpaRouterModule, useNavigate, useUrl, Link } from '@tramvai/module-router';
import { modules } from '../common';

const Navigation = ['/1/', '/2/', '/3/'];

function Page() {
  // useUrl позволяет получить текущий url
  const { pathname, path } = useUrl();
  // useNavigate позволяет получить функцию, с помощью которой можно вызвать навигацию
  const navigate = useNavigate();
  // useNavigate также позволяет задать свойства сразу, чтобы результат можно было передать сразу как калбек
  const navigateToRoot = useNavigate({ url: '/', query: { a: '1', b: '2' } });

  return (
    <div>
      <div>Current Path: {path}</div>
      <div>
        <button type="button" onClick={navigateToRoot}>
          Navigate to Root
        </button>
        {/* компонент Link позволяет создать ссылку с переходом */}
        <Link url="/link/" replace>
          <button type="button">Navigate By Link</button>
        </Link>
      </div>
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

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
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
