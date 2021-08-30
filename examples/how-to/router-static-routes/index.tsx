import React from 'react';
import { createApp, createBundle } from '@tramvai/core';
import { useSelector } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { SpaRouterModule, ROUTES_TOKEN, PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

import { modules } from '../common';

const Navigation = ['/1/', '/2/', '/3/'];

function Page() {
  // useSelector чтобы получить текущий роут
  // стор 'router' предоставляется RouterModule
  const state = useSelector('router', (x) => x.router);
  // pageService - обертка для работы с роутером, можно получить различные свойства и инициировать переход
  // но через useDi нельзя подписаться на изменения данных внутри сервисов поэтому для подписки на изменения роута
  // используется useSelector выше
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
    // статичный метод forRoot позволяет определить статичные роуты в приложении -
    // эти роуты всегда доступны и конфиг для них не грузится из админки, а задаются тут же
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
      // также можно задать статичные роуты отдельным провайдером
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
