import { createApp } from '@tramvai/core';
import { HTML_ATTRS } from '@tramvai/module-render';
import { modules, bundles } from '@tramvai/internal-test-utils/shared/common';
import { StorageRecord } from '@tinkoff/htmlpagebuilder';
import { RESOURCE_INLINE_OPTIONS } from '@tramvai/tokens-render';

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
    {
      provide: RESOURCE_INLINE_OPTIONS,
      useValue: {
        threshold: 10000,
        types: [StorageRecord.style],
      },
    },
  ],
});
