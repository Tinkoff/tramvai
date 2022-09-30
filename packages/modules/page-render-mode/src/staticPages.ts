import isEmpty from '@tinkoff/utils/is/empty';
import type { Counter } from 'prom-client';
import { commandLineListTokens, createToken, DI_TOKEN, provide, Scope } from '@tramvai/core';
import {
  CREATE_CACHE_TOKEN,
  ENV_MANAGER_TOKEN,
  FASTIFY_RESPONSE,
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import { MODERN_SATISFIES_TOKEN } from '@tramvai/tokens-render';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import { SERVER_MODULE_PAPI_PRIVATE_ROUTE } from '@tramvai/tokens-server';
import { METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';
import { createPapiMethod } from '@tramvai/papi';
import { StopCommandLineRunnerError } from './error';
import {
  PAGE_RENDER_DEFAULT_MODE,
  STATIC_PAGES_CACHE_TOKEN,
  STATIC_PAGES_OPTIONS_TOKEN,
  STATIC_PAGES_COMMAND_LINE,
  STATIC_PAGES_BACKGROUND_FETCH_ENABLED,
  STATIC_PAGES_SHOULD_USE_CACHE,
  STATIC_PAGES_SHOULD_SET_TO_CACHE,
  STATIC_PAGES_MODIFY_CACHE,
  STATIC_PAGES_CACHE_5xx_RESPONSE,
} from './tokens';
import { getPageRenderMode } from './utils/getPageRenderMode';
import { getCacheKey } from './utils/cacheKey';
import { BackgroundFetchService } from './staticPages/backgroundFetchService';
import { StaticPagesService } from './staticPages/staticPagesService';

export const STATIC_PAGES_BACKGROUND_FETCH_SERVICE = createToken<BackgroundFetchService>();

export const STATIC_PAGES_GET_CACHE_KEY_TOKEN = createToken<() => string>();

export const STATIC_PAGES_CACHE_HIT_METRIC_TOKEN = createToken<Counter<any>>();

export const STATIC_PAGES_SERVICE = createToken<StaticPagesService>();

export const staticPagesProviders = [
  provide({
    provide: STATIC_PAGES_CACHE_HIT_METRIC_TOKEN,
    scope: Scope.SINGLETON,
    useFactory: ({ metrics }) => {
      return metrics.counter({
        name: 'static_pages_cache_hit',
        help: 'Total static pages returned from cache',
        labelNames: [],
      });
    },
    deps: {
      metrics: METRICS_MODULE_TOKEN,
    },
  }),
  provide({
    provide: STATIC_PAGES_CACHE_TOKEN,
    scope: Scope.SINGLETON,
    useFactory: ({ createCache, staticPagesOptions }) => {
      return createCache('memory', {
        max: staticPagesOptions.maxSize,
      });
    },
    deps: {
      createCache: CREATE_CACHE_TOKEN,
      staticPagesOptions: STATIC_PAGES_OPTIONS_TOKEN,
    },
  }),
  provide({
    provide: STATIC_PAGES_OPTIONS_TOKEN,
    useValue: {
      // @TODO: свой ttl для отдельных страниц
      ttl: 60 * 1000,
      maxSize: 1000,
    },
  }),
  provide({
    provide: STATIC_PAGES_GET_CACHE_KEY_TOKEN,
    useFactory: ({ requestManager, userAgent, modern }) => {
      return () => {
        const deviceType = userAgent.mobileOS ? 'mobile' : 'desktop';

        return getCacheKey({
          method: requestManager.getMethod(),
          host: requestManager.getHost(),
          path: requestManager.getParsedUrl().pathname,
          deviceType,
          modern,
        });
      };
    },
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
      userAgent: USER_AGENT_TOKEN,
      modern: MODERN_SATISFIES_TOKEN,
    },
  }),
  provide({
    provide: STATIC_PAGES_SHOULD_SET_TO_CACHE,
    useFactory: ({ requestManager }) => {
      return () => {
        return isEmpty(requestManager.getCookies());
      };
    },
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: STATIC_PAGES_SHOULD_USE_CACHE,
    useFactory: ({ requestManager }) => {
      return () => {
        return !requestManager.getHeader('x-tramvai-static-page-revalidate');
      };
    },
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: STATIC_PAGES_BACKGROUND_FETCH_ENABLED,
    useValue: () => {
      return true;
    },
  }),
  provide({
    provide: STATIC_PAGES_CACHE_5xx_RESPONSE,
    useValue: () => {
      return false;
    },
  }),
  provide({
    provide: STATIC_PAGES_BACKGROUND_FETCH_SERVICE,
    scope: Scope.REQUEST,
    useClass: BackgroundFetchService,
    deps: {
      logger: LOGGER_TOKEN,
      backgroundFetchEnabled: STATIC_PAGES_BACKGROUND_FETCH_ENABLED,
    },
  }),
  provide({
    provide: STATIC_PAGES_SERVICE,
    scope: Scope.REQUEST,
    useClass: StaticPagesService,
    deps: {
      getCacheKey: STATIC_PAGES_GET_CACHE_KEY_TOKEN,
      requestManager: REQUEST_MANAGER_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
      response: FASTIFY_RESPONSE,
      environmentManager: ENV_MANAGER_TOKEN,
      userAgent: USER_AGENT_TOKEN,
      modern: MODERN_SATISFIES_TOKEN,
      logger: LOGGER_TOKEN,
      cache: STATIC_PAGES_CACHE_TOKEN,
      modifyCache: { token: STATIC_PAGES_MODIFY_CACHE, optional: true },
      shouldUseCache: STATIC_PAGES_SHOULD_USE_CACHE,
      shouldSetToCache: STATIC_PAGES_SHOULD_SET_TO_CACHE,
      backgroundFetchService: STATIC_PAGES_BACKGROUND_FETCH_SERVICE,
      options: STATIC_PAGES_OPTIONS_TOKEN,
      cache5xxResponse: STATIC_PAGES_CACHE_5xx_RESPONSE,
    },
  }),
  provide({
    provide: commandLineListTokens.init,
    multi: true,
    scope: Scope.SINGLETON,
    useFactory: ({ di, staticPagesCommandLine }) => {
      return function registerResponseCacheHandler() {
        di.register({
          provide: staticPagesCommandLine
            ? commandLineListTokens[staticPagesCommandLine]
            : commandLineListTokens.customerStart,
          useFactory: ({ staticPagesService, staticPagesCacheHitMetric, logger }) => {
            const log = logger('static-pages');

            return function staticPagesFromCache() {
              if (staticPagesService.shouldUseCache()) {
                staticPagesService.respond(() => {
                  // @TODO: маска урла на этом этапе?
                  staticPagesCacheHitMetric.inc();

                  throw new StopCommandLineRunnerError();
                });
              }
            };
          },
          deps: {
            staticPagesService: STATIC_PAGES_SERVICE,
            staticPagesCacheHitMetric: STATIC_PAGES_CACHE_HIT_METRIC_TOKEN,
            logger: LOGGER_TOKEN,
          },
        });
      };
    },
    deps: {
      di: DI_TOKEN,
      staticPagesCommandLine: { token: STATIC_PAGES_COMMAND_LINE, optional: true },
    },
  }),
  provide({
    provide: commandLineListTokens.clear,
    useFactory: ({ staticPagesService, pageService, defaultRenderMode }) => {
      return function cacheStaticPages() {
        const isStaticPage = getPageRenderMode({ pageService, defaultRenderMode }) === 'static';

        if (!isStaticPage) {
          return;
        }

        if (staticPagesService.shouldSetToCache()) {
          staticPagesService.saveResponse();
        } else {
          staticPagesService.revalidate();
        }
      };
    },
    deps: {
      staticPagesService: STATIC_PAGES_SERVICE,
      pageService: PAGE_SERVICE_TOKEN,
      defaultRenderMode: PAGE_RENDER_DEFAULT_MODE,
    },
  }),
  provide({
    provide: SERVER_MODULE_PAPI_PRIVATE_ROUTE,
    useFactory: ({ staticPagesCache }) => {
      return createPapiMethod({
        path: '/revalidate/',
        method: 'post',
        async handler({ body = {} }) {
          const { path } = body;
          const pathKey = `/${path}/`;

          if (!path) {
            staticPagesCache.clear();
          } else if (staticPagesCache.has(pathKey)) {
            staticPagesCache.set(pathKey, new Map());
            // @TODO: revalidate request with background fetch?
          }

          return 'Success';
        },
      });
    },
    deps: {
      staticPagesCache: STATIC_PAGES_CACHE_TOKEN,
    },
  }),
];
