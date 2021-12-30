import { createApp, provide } from '@tramvai/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HTML_ATTRS } from '@tramvai/module-render';
import { modules, bundles } from '@tramvai/internal-test-utils/shared/common';
import { ROUTES_TOKEN } from '@tramvai-tinkoff/module-router';

createApp({
  name: 'render',
  modules,
  bundles: {
    ...bundles,
    image: () => import(/* webpackChunkName: "image" */ './bundles/image'),
  },
  providers: [
    {
      provide: HTML_ATTRS,
      useValue: {
        target: 'html',
        attrs: {
          class: 'html',
          lang: 'ru',
        },
      },
      multi: true,
    },
    {
      provide: HTML_ATTRS,
      useValue: {
        target: 'body',
        attrs: {
          style: 'display: block; margin: 0;',
        },
      },
      multi: true,
    },
    {
      provide: HTML_ATTRS,
      useValue: {
        target: 'app',
        attrs: {
          'data-attr': 'value',
          bool: true,
        },
      },
      multi: true,
    },
    provide({
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: {
        name: 'image',
        path: '/image/',
        config: {
          bundle: 'image',
        },
      },
    }),
  ],
});
