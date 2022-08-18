import { commandLineListTokens, DI_TOKEN, Module, provide, Scope } from '@tramvai/core';
import {
  CREATE_CACHE_TOKEN,
  FASTIFY_RESPONSE,
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import { getCacheEntry } from './cache';
import { defaultSettingsProviders } from './default';
import { StopCommandLineRunnerError } from './error';
import {
  RESPONSE_CACHE_GET_CACHE_KEY,
  RESPONSE_CACHE_INSTANCE,
  RESPONSE_CACHE_OPTIONS,
  RESPONSE_CACHE_SHOULD_SET_TO_CACHE,
  RESPONSE_CACHE_SHOULD_USE_CACHE,
} from './tokens';
import type { ResponseCacheEntry } from './types';

export * from './tokens';

@Module({
  providers: [
    ...defaultSettingsProviders,
    provide({
      provide: RESPONSE_CACHE_INSTANCE,
      scope: Scope.SINGLETON,
      useFactory: ({ createCache, options }) => {
        return createCache('memory', {
          max: options.maxSize,
        });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
        options: RESPONSE_CACHE_OPTIONS,
      },
    }),
    provide({
      provide: commandLineListTokens.init,
      multi: true,
      scope: Scope.SINGLETON,
      useFactory: ({ di, options }) => {
        return function registerResponseCacheHandler() {
          di.register(
            provide({
              provide: options.line || commandLineListTokens.customerStart,
              multi: true,
              useFactory: ({
                logger,
                requestManager,
                response,
                cache,
                shouldUseCache,
                getCacheKey,
              }) => {
                const { ttl } = options;
                const log = logger('response-cache');

                return async function responseCacheGet() {
                  if (shouldUseCache()) {
                    log.debug({
                      event: 'cache-in-use',
                      url: requestManager.getUrl(),
                    });

                    const cacheKey = getCacheKey();
                    const fromCache: ResponseCacheEntry = cache.get(cacheKey);

                    if (fromCache) {
                      const { updatedAt, status, headers, body } = fromCache;
                      const isOutdated = updatedAt + ttl <= Date.now();

                      log.debug({
                        event: 'cache-hit',
                        cacheKey,
                        isOutdated,
                      });

                      response
                        .header('content-type', 'text/html')
                        .header('X-Tramvai-Response-Cache', 'true')
                        .headers(headers)
                        .status(status)
                        .send(body);

                      if (!isOutdated) {
                        // if entry is fresh throw error to prevent any additional
                        throw new StopCommandLineRunnerError();
                      }

                      // preserve outdated value in cache anyway to use it in parallel requests while the value is updating
                      cache.set(cacheKey, { ...fromCache, updatedAt: Date.now() });

                      // otherwise execute request handling as usual to update cache entry at the end
                    } else {
                      log.debug({
                        event: 'cache-miss',
                        cacheKey,
                        url: requestManager.getUrl(),
                      });
                    }
                  } else {
                    log.debug({
                      event: 'cache-disabled',
                      url: requestManager.getUrl(),
                    });
                  }
                };
              },
              deps: {
                logger: LOGGER_TOKEN,
                requestManager: REQUEST_MANAGER_TOKEN,
                response: FASTIFY_RESPONSE,
                shouldUseCache: RESPONSE_CACHE_SHOULD_USE_CACHE,
                getCacheKey: RESPONSE_CACHE_GET_CACHE_KEY,
                cache: RESPONSE_CACHE_INSTANCE,
              },
            })
          );
        };
      },
      deps: {
        di: DI_TOKEN,
        options: RESPONSE_CACHE_OPTIONS,
      },
    }),
    provide({
      provide: commandLineListTokens.clear,
      multi: true,
      useFactory: ({
        logger,
        requestManager,
        responseManager,
        cache,
        shouldSetCache,
        getCacheKey,
      }) => {
        const log = logger('response-cache');

        return function responseCacheSet() {
          if (shouldSetCache()) {
            log.debug({
              event: 'cache-set',
              url: requestManager.getUrl(),
            });

            const key = getCacheKey();
            const value = getCacheEntry(responseManager);

            cache.set(key, value);
          } else {
            log.debug({
              event: 'cache-set-disabled',
              url: requestManager.getUrl(),
            });
          }
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        requestManager: REQUEST_MANAGER_TOKEN,
        responseManager: RESPONSE_MANAGER_TOKEN,
        shouldSetCache: RESPONSE_CACHE_SHOULD_SET_TO_CACHE,
        getCacheKey: RESPONSE_CACHE_GET_CACHE_KEY,
        cache: RESPONSE_CACHE_INSTANCE,
      },
    }),
  ],
})
export class ServerResponseCacheModule {}
