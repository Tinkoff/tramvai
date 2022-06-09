import { createToken } from '@tinkoff/dippy';
import { Module, Scope, IS_DI_CHILD_CONTAINER_TOKEN } from '@tramvai/core';
import type { Cache, CacheFactory } from '@tramvai/tokens-common';
import {
  CLEAR_CACHE_TOKEN,
  CREATE_CACHE_TOKEN,
  REGISTER_CLEAR_CACHE_TOKEN,
} from '@tramvai/tokens-common';
import { cacheFactory } from './cacheFactory';
import { providers } from './serverProviders';

export const cachesToken = createToken<Cache[]>('_cachesList');

@Module({
  providers: [
    ...providers,
    {
      provide: cachesToken,
      scope: Scope.SINGLETON,
      useValue: [],
    },
    {
      provide: CREATE_CACHE_TOKEN,
      useFactory: ({ caches, isChildDi }): CacheFactory => {
        if (isChildDi) {
          return cacheFactory;
        }

        return (type?, ...args) => {
          const cache = cacheFactory(type, ...args);

          caches.push(cache);

          return cache;
        };
      },
      deps: {
        caches: cachesToken,
        isChildDi: { token: IS_DI_CHILD_CONTAINER_TOKEN, optional: true },
      },
    },
    {
      provide: CLEAR_CACHE_TOKEN,
      scope: Scope.SINGLETON,
      useFactory: ({ caches, cachesClear }) => {
        return (type?: string) => {
          caches.forEach((cache: Cache) => cache.clear());

          if (cachesClear) {
            return Promise.all(cachesClear.map((clear: (type?: string) => void) => clear(type)));
          }

          return Promise.resolve();
        };
      },
      deps: {
        caches: cachesToken,
        cachesClear: { token: REGISTER_CLEAR_CACHE_TOKEN, optional: true },
      },
    },
  ],
})
export class CacheModule {}
