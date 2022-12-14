import { createApp, provide, Scope } from '@tramvai/core';
import { CREATE_CACHE_TOKEN } from '@tramvai/tokens-common';
import { PAPI_CACHE_TOKEN } from './tokens';
import { modules } from '../common';

createApp({
  name: 'server',
  modules: [...modules],
  bundles: {},
  providers: [
    provide({
      provide: PAPI_CACHE_TOKEN,
      // Singleton provider that might be used by papi handlers and that will be initialized only once on app start
      scope: Scope.SINGLETON,
      useFactory: ({ createCache }) => {
        return createCache('memory');
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
    }),
  ],
});
