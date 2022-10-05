import { createApp, createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { MockerModule } from '@tramvai/module-mocker';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/tokens-common';
import { HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
import { modules } from '../../../../test/shared/common';
import { FAKE_API_CLIENT } from './fakeApiClient';
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

createApp({
  name: 'react-query',
  modules: [...modules, MockerModule, ReactQueryModule],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
  providers: [
    {
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: routes,
    },
    {
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: 'FAKE_API',
          value: 'https://fake-api.com/',
        },
      ],
    },
    {
      provide: FAKE_API_CLIENT,
      useFactory: ({ factory, envManager }) => {
        return factory({
          name: 'fake-api',
          baseUrl: envManager.get('FAKE_API'),
        });
      },
      deps: {
        factory: HTTP_CLIENT_FACTORY,
        envManager: ENV_MANAGER_TOKEN,
      },
    },
  ],
});
