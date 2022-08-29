import { createApp, createBundle } from '@tramvai/core';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
import { lazy } from '@tramvai/react';
import { modules } from '../common';
import { routes } from './routes';

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    'use-query-base': lazy(() => import('./components/use-query-base')),
    'use-query-prefetch': lazy(() => import('./components/use-query-prefetch')),
    'use-query-fetch': lazy(() => import('./components/use-query-fetch')),
    'use-same-query-many-components': lazy(
      () => import('./components/use-same-query-many-components')
    ),
    'use-query-parameters': lazy(() => import('./components/use-query-parameters')),
    'use-query-options': lazy(() => import('./components/use-query-options')),
    'use-query-fail': lazy(() => import('./components/use-query-fail')),
    'use-infinite-query': lazy(() => import('./components/use-infinite-query')),
    'use-mutation': lazy(() => import('./components/use-mutation')),
    'use-query-conditions': lazy(() => import('./components/use-query-conditions')),
    'use-queries': lazy(() => import('./components/use-queries')),
  },
});

let DevToolsModule: any;

try {
  DevToolsModule = require('@tramvai/module-dev-tools').DevToolsModule;
} catch {}

let ReactQueryDevtoolsModule: any;

try {
  ReactQueryDevtoolsModule = require('@tramvai/module-react-query-devtools')
    .ReactQueryDevtoolsModule;
} catch {}

createApp({
  name: 'react-query-usage',
  modules: [
    ...modules,
    ReactQueryModule,
    ...(process.env.NODE_ENV === 'development' && DevToolsModule && ReactQueryDevtoolsModule
      ? [DevToolsModule, ReactQueryDevtoolsModule]
      : []),
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
  providers: [
    {
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: routes,
    },
  ],
});
