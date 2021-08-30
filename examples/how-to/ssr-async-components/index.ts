import { createApp, createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';
import { modules } from '../common';

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    // оборачиваем импорт в вызов lazy чтобы компонент нормально рендерился на сервере
    // и скрипты\стили для компонента предзагружались на клиенте
    pageDefault: lazy(() => import('./pages/page')),
    secondPage: lazy(() => import('./pages/secondPage')),
  },
});

createApp({
  name: 'ssr-async-components',
  modules: [...modules],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
