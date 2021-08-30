import { createApp, provide } from '@tramvai/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HTML_ATTRS, RESOURCE_INLINE_OPTIONS, ResourceType } from '@tramvai/module-render';
import { modules, bundles } from '@tramvai/internal-test-utils/shared/common';

createApp({
  name: 'render',
  modules,
  bundles,
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
  ],
});
