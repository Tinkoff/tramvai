import type { Provider } from '@tramvai/core';
import { Module, provide, APP_INFO_TOKEN } from '@tramvai/core';
import type { Cache } from '@tramvai/tokens-common';
import { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import {
  CREATE_CACHE_TOKEN,
  ENV_MANAGER_TOKEN,
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/module-common';
import { createMockEnvManager } from './envManager';
import { createMockCookieManager } from './cookie';
import { createMockLogger } from './logger';
import { createMockAppInfo } from './appInfo';
import { createMockRequestManager } from './requestManager';
import { createMockCache } from './cache';
import { createMockContext } from './context';

export type CommonModuleOptions = {
  env?: Parameters<typeof createMockEnvManager>[0];
  cookies?: Parameters<typeof createMockCookieManager>[0];
  onCacheCreated?: (cache: Cache) => void;
};

@Module({
  providers: [
    provide({
      provide: ENV_MANAGER_TOKEN,
      useValue: createMockEnvManager(),
    }),
    provide({
      provide: LOGGER_TOKEN,
      useValue: createMockLogger(),
    }),
    provide({
      provide: APP_INFO_TOKEN,
      useValue: createMockAppInfo(),
    }),
    provide({
      provide: REQUEST_MANAGER_TOKEN,
      useValue: createMockRequestManager(),
    }),
    provide({
      provide: CREATE_CACHE_TOKEN,
      useValue: () => createMockCache(),
    }),
    provide({
      provide: COOKIE_MANAGER_TOKEN,
      useValue: createMockCookieManager(),
    }),
    provide({
      provide: CONTEXT_TOKEN,
      useValue: createMockContext(),
    }),
  ],
})
export class CommonTestModule {
  static forRoot(options: CommonModuleOptions) {
    const providers: Provider[] = [];
    const { env, cookies, onCacheCreated } = options;

    if (env) {
      providers.push({
        provide: ENV_MANAGER_TOKEN,
        useValue: createMockEnvManager(env),
      });
    }

    if (cookies) {
      providers.push({
        provide: COOKIE_MANAGER_TOKEN,
        useValue: createMockCookieManager(cookies),
      });
    }

    if (onCacheCreated) {
      providers.push({
        provide: CREATE_CACHE_TOKEN,
        useValue: () => {
          const cache = createMockCache();

          onCacheCreated(cache);

          return cache;
        },
      });
    }

    return {
      providers,
      mainModule: CommonTestModule,
    };
  }
}
