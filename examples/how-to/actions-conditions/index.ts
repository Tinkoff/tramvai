import { createApp, createBundle, provide } from '@tramvai/core';
import { ACTION_CONDITIONALS } from '@tramvai/module-common';
import { PAGE_SERVICE_TOKEN, ROUTES_TOKEN } from '@tramvai/tokens-router';

import { store } from './store';
import { modules } from '../common';
import { condition } from './conditions/custom';
import { Page } from './components/Page';

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
  },
  reducers: [store],
});

createApp({
  name: 'actions-conditions',
  modules: [...modules],
  providers: [
    provide({
      provide: ACTION_CONDITIONALS,
      multi: true,
      useFactory: condition,
      deps: {
        pageService: PAGE_SERVICE_TOKEN,
      },
    }),
    provide({
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: {
        name: 'custom',
        path: '/custom/',
      },
    }),
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
