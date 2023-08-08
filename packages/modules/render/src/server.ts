import { Module, commandLineListTokens, DI_TOKEN, provide } from '@tramvai/core';
import {
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  CONTEXT_TOKEN,
  CREATE_CACHE_TOKEN,
} from '@tramvai/tokens-common';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { ClientHintsModule, USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import {
  RESOURCES_REGISTRY,
  RENDER_SLOTS,
  CUSTOM_RENDER,
  POLYFILL_CONDITION,
  EXTEND_RENDER,
  HTML_ATTRS,
  RESOURCE_INLINE_OPTIONS,
  ResourceType,
  RENDER_FLOW_AFTER_TOKEN,
  MODERN_SATISFIES_TOKEN,
  BACK_FORWARD_CACHE_ENABLED,
  REACT_SERVER_RENDER_MODE,
  FETCH_WEBPACK_STATS_TOKEN,
} from '@tramvai/tokens-render';
import { Scope } from '@tinkoff/dippy';
import { satisfies } from '@tinkoff/user-agent';
import { isRedirectFoundError } from '@tinkoff/errors';
import { PageErrorStore, setPageErrorEvent, deserializeError } from '@tramvai/module-router';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/module-common';
import { RESOURCE_INLINER, RESOURCES_REGISTRY_CACHE, ResourcesInliner } from './resourcesInliner';
import { ResourcesRegistry } from './resourcesRegistry';
import { PageBuilder } from './server/PageBuilder';
import { htmlPageSchemaFactory } from './server/htmlPageSchema';
import { ReactRenderServer } from './server/ReactRenderServer';
import type { RenderModuleConfig } from './shared/types';
import { LayoutModule } from './shared/LayoutModule';
import { providers as sharedProviders } from './shared/providers';
import { fetchWebpackStats } from './server/blocks/utils/fetchWebpackStats';

export { PageErrorStore, setPageErrorEvent };
export * from '@tramvai/tokens-render';

const REQUEST_TTL = 5 * 60 * 1000;

export const DEFAULT_POLYFILL_CONDITION =
  '!window.Promise.prototype.finally || !window.URL || !window.URLSearchParams || !window.AbortController || !window.IntersectionObserver || !Object.fromEntries || !window.ResizeObserver';

@Module({
  imports: [ClientHintsModule, LayoutModule],
  providers: [
    ...sharedProviders,
    provide({
      provide: RESOURCES_REGISTRY,
      useClass: ResourcesRegistry,
      deps: {
        resourceInliner: RESOURCE_INLINER,
      },
    }),
    provide({
      provide: RESOURCES_REGISTRY_CACHE,
      scope: Scope.SINGLETON,
      useFactory: ({ createCache }) => {
        return {
          filesCache: createCache('memory', { max: 50 }),
          sizeCache: createCache('memory', { max: 100 }),
          disabledUrlsCache: createCache('memory', { max: 150, ttl: REQUEST_TTL }),
        };
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
    }),
    provide({
      provide: RESOURCE_INLINER,
      scope: Scope.SINGLETON,
      useClass: ResourcesInliner,
      deps: {
        resourcesRegistryCache: RESOURCES_REGISTRY_CACHE,
        resourceInlineThreshold: { token: RESOURCE_INLINE_OPTIONS, optional: true },
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.generatePage,
      useFactory: ({
        htmlBuilder,
        logger,
        requestManager,
        responseManager,
        context,
        bfcacheEnabled,
        pageService,
      }) => {
        const log = logger('module-render');

        // eslint-disable-next-line max-statements
        return async function render() {
          const pageErrorBoundary = pageService.resolveComponentFromConfig('errorBoundary');
          let html: string;

          try {
            html = await htmlBuilder.flow();
          } catch (error) {
            // if there is no Page Error Boundary, will try to render Root Error Boundary later in error handler
            if (!pageErrorBoundary) {
              throw error;
            }

            // assuming that there was an error when rendering the page, try to render again with Page Error Boundary
            try {
              context.dispatch(setPageErrorEvent(error));

              html = await htmlBuilder.flow();

              log.info({
                event: 'render-page-error-boundary',
                message: 'Render Page Error Boundary for the client',
              });
            } catch (e) {
              log.warn({
                event: 'failed-page-error-boundary',
                message: 'Page Error Boundary rendering failed',
                error: e,
              });

              // pass page render error to default error handler
              throw error;
            }
          }

          const pageRenderError = context.getState(PageErrorStore);

          // if there is no Page Error Boundary and page error exists, that means that page render was interrupted and current `html` is invalid
          // if it is RedirectFoundError, also pass it to default error handler
          if (
            pageRenderError &&
            (!pageErrorBoundary || isRedirectFoundError(pageRenderError as Error))
          ) {
            throw pageRenderError;
          }

          // log send-server-error only after successful Page Boundary render,
          // otherwise this event will be logged in default error handler
          if (pageRenderError) {
            const status = pageRenderError.httpStatus || 500;
            const error = deserializeError(pageRenderError);
            const requestInfo = {
              ip: requestManager.getClientIp(),
              requestId: requestManager.getHeader('x-request-id'),
              url: requestManager.getUrl(),
            };

            if ('httpStatus' in pageRenderError) {
              if (pageRenderError.httpStatus >= 500) {
                log.error({
                  event: 'send-server-error',
                  message: `This is expected server error, here is most common cases:
- Forced Page Error Boundary render with 5xx code in Guard or Action - https://tramvai.dev/docs/features/error-boundaries#force-render-page-error-boundary-in-action.
Page Error Boundary will be rendered for the client`,
                  error,
                  requestInfo,
                });
              } else {
                log.info({
                  event: 'http-error',
                  message: `This is expected server error, here is most common cases:
- Forced Page Error Boundary render with 4xx code in Guard or Action - https://tramvai.dev/docs/features/error-boundaries#force-render-page-error-boundary-in-action.
Page Error Boundary will be rendered for the client`,
                  error,
                  requestInfo,
                });
              }
            } else {
              log.error({
                event: 'send-server-error',
                message: `Unexpected server error. Error cause will be in "error" parameter.
Most likely an error has occurred in the rendering of the current React page component.
Page Error Boundary will be rendered for the client`,
                error,
                requestInfo,
              });
            }

            responseManager.setStatus(status);
          }

          // Проставляем не кэширующие заголовки
          // TODO Заменить после выкатки на прод и прохода всех тестов на cache-control = no-cache,no-store,max-age=0,must-revalidate
          responseManager.setHeader('expires', '0');
          responseManager.setHeader('pragma', 'no-cache');
          responseManager.setHeader(
            'cache-control',
            `${bfcacheEnabled ? '' : 'no-store, '}no-cache, must-revalidate`
          );

          responseManager.setBody(html);
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        requestManager: REQUEST_MANAGER_TOKEN,
        responseManager: RESPONSE_MANAGER_TOKEN,
        htmlBuilder: 'htmlBuilder',
        context: CONTEXT_TOKEN,
        pageService: PAGE_SERVICE_TOKEN,
        bfcacheEnabled: BACK_FORWARD_CACHE_ENABLED,
      },
      multi: true,
    }),
    provide({
      provide: 'htmlBuilder',
      useClass: PageBuilder,
      deps: {
        reactRender: 'reactRender',
        pageService: PAGE_SERVICE_TOKEN,
        resourcesRegistry: RESOURCES_REGISTRY,
        context: CONTEXT_TOKEN,
        htmlPageSchema: 'htmlPageSchema',
        renderSlots: { token: RENDER_SLOTS, optional: true },
        polyfillCondition: POLYFILL_CONDITION,
        htmlAttrs: HTML_ATTRS,
        modern: MODERN_SATISFIES_TOKEN,
        renderFlowAfter: { token: RENDER_FLOW_AFTER_TOKEN, optional: true },
        logger: LOGGER_TOKEN,
        fetchWebpackStats: FETCH_WEBPACK_STATS_TOKEN,
      },
    }),
    provide({
      provide: 'reactRender',
      useClass: ReactRenderServer,
      deps: {
        context: CONTEXT_TOKEN,
        customRender: { token: CUSTOM_RENDER, optional: true },
        extendRender: { token: EXTEND_RENDER, optional: true },
        di: DI_TOKEN,
        renderMode: { token: REACT_SERVER_RENDER_MODE, optional: true },
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      provide: 'htmlPageSchema',
      useFactory: htmlPageSchemaFactory,
      deps: {
        htmlAttrs: HTML_ATTRS,
      },
    }),
    provide({
      provide: HTML_ATTRS,
      useValue: {
        target: 'html',
        attrs: {
          class: 'no-js',
          lang: 'ru',
        },
      },
      multi: true,
    }),
    provide({
      provide: HTML_ATTRS,
      useValue: {
        target: 'app',
        attrs: {
          class: 'application',
        },
      },
      multi: true,
    }),
    provide({
      provide: POLYFILL_CONDITION,
      useValue: DEFAULT_POLYFILL_CONDITION,
    }),
    provide({
      // by default, enable inlining for css files with size below 40kb before gzip
      provide: RESOURCE_INLINE_OPTIONS,
      useValue: {
        threshold: 40960, // 40kb before gzip, +-10kb after gzip
        types: [ResourceType.style],
      },
    }),
    provide({
      provide: MODERN_SATISFIES_TOKEN,
      useFactory: ({ requestManager, userAgent, cache, cookieManager }) => {
        const reqUserAgent = requestManager.getHeader('user-agent') as string;
        let result: boolean;

        if (cache.has(reqUserAgent)) {
          result = cache.get(reqUserAgent);
        } else {
          result = satisfies(userAgent, null, { env: 'modern' });
          cache.set(reqUserAgent, result);
        }

        cookieManager.set({ name: '_t_modern', value: JSON.stringify(result) });

        return result;
      },
      deps: {
        requestManager: REQUEST_MANAGER_TOKEN,
        userAgent: USER_AGENT_TOKEN,
        cache: 'modernSatisfiesMemoryCache',
        cookieManager: COOKIE_MANAGER_TOKEN,
      },
    }),
    provide({
      provide: 'modernSatisfiesMemoryCache',
      scope: Scope.SINGLETON,
      // @todo - use larger `max` option and `memory-lfu` type after successful TCORE-4668 experiment
      useFactory: ({ createCache }) => {
        return createCache('memory', { max: 50 });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
    }),
    provide({
      provide: FETCH_WEBPACK_STATS_TOKEN,
      useValue: fetchWebpackStats,
    }),
    provide({
      provide: BACK_FORWARD_CACHE_ENABLED,
      useValue: true,
    }),
  ],
})
export class RenderModule {
  static forRoot({ polyfillCondition }: RenderModuleConfig) {
    const providers = [];

    if (typeof polyfillCondition === 'string') {
      providers.push({
        provide: POLYFILL_CONDITION,
        useValue: polyfillCondition,
      });
    }

    return {
      mainModule: RenderModule,
      providers,
    };
  }
}
export { ReactRenderServer } from './server/ReactRenderServer';
