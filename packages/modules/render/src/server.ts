import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
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
} from '@tramvai/tokens-render';
import { Scope } from '@tinkoff/dippy';
import { WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN } from '@tramvai/tokens-server-private';
import { ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN } from '@tramvai/react';
import { parse } from '@tinkoff/url';
import { satisfies } from '@tinkoff/user-agent';
import { RESOURCE_INLINER, RESOURCES_REGISTRY_CACHE, ResourcesInliner } from './resourcesInliner';
import { ResourcesRegistry } from './resourcesRegistry';
import { PageBuilder } from './server/PageBuilder';
import { htmlPageSchemaFactory } from './server/htmlPageSchema';
import { ReactRenderServer } from './server/ReactRenderServer';
import type { RenderModuleConfig } from './shared/types';
import { LayoutModule } from './shared/LayoutModule';
import { providers as sharedProviders } from './shared/providers';
import { PageErrorStore, setPageErrorEvent, deserializeError } from './shared/pageErrorStore';

export * from './shared/pageErrorStore';
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
      useFactory: ({ htmlBuilder, logger, requestManager, responseManager, context }) => {
        const log = logger('module-render');

        return async function render() {
          let html: string;

          try {
            html = await htmlBuilder.flow();
          } catch (error) {
            // assuming that there was an error when rendering the page, try to render again with ErrorBoundary
            try {
              log.info({ event: 'render-page-boundary-start' });

              context.dispatch(setPageErrorEvent(error));
              html = await htmlBuilder.flow();

              log.info({ event: 'render-page-boundary-success' });
            } catch (e) {
              log.warn({ event: 'render-page-boundary-error', error: e });
              // pass page render error to default error handler,
              // send-server-error event will be logged with this error
              throw error;
            }
          }

          const pageRenderError = context.getState(PageErrorStore);

          // log send-server-error only after successful Page Boundary render,
          // otherwise this event will be logged in default error handler
          if (pageRenderError) {
            const status = pageRenderError.status || pageRenderError.httpStatus || 500;

            if (status >= 500) {
              const requestInfo = {
                ip: requestManager.getClientIp(),
                requestId: requestManager.getHeader('x-request-id'),
                url: requestManager.getUrl(),
              };

              log.error({
                event: 'send-server-error',
                message: 'Page render error, switch to page boundary',
                error: deserializeError(pageRenderError),
                requestInfo,
              });
            }

            responseManager.setStatus(status);
          }

          // Проставляем не кэширующие заголовки
          // TODO Заменить после выкатки на прод и прохода всех тестов на cache-control = no-cache,no-store,max-age=0,must-revalidate
          responseManager.setHeader('expires', '0');
          responseManager.setHeader('pragma', 'no-cache');
          responseManager.setHeader('cache-control', 'no-cache, no-store, must-revalidate');

          responseManager.setBody(html);
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        requestManager: REQUEST_MANAGER_TOKEN,
        responseManager: RESPONSE_MANAGER_TOKEN,
        htmlBuilder: 'htmlBuilder',
        context: CONTEXT_TOKEN,
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
      },
    }),
    provide({
      provide: 'reactRender',
      useClass: ReactRenderServer,
      deps: {
        context: CONTEXT_TOKEN,
        pageService: PAGE_SERVICE_TOKEN,
        customRender: { token: CUSTOM_RENDER, optional: true },
        extendRender: { token: EXTEND_RENDER, optional: true },
        di: DI_TOKEN,
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
      provide: WEB_FASTIFY_APP_BEFORE_ERROR_TOKEN,
      multi: true,
      useFactory: ({ RootErrorBoundary, logger }) => {
        const log = logger('module-render:error-handler');

        return (error: any, request, reply) => {
          if (!RootErrorBoundary) {
            return;
          }

          let body: string;

          try {
            log.info({ event: 'render-root-boundary-start' });

            body = renderToString(
              createElement(RootErrorBoundary, { error, url: parse(request.url) })
            );

            log.info({ event: 'render-root-boundary-success' });

            const status = error.status || error.httpStatus || 500;

            // log send-server-error only after successful Root Boundary render,
            // otherwise this event will be logged in default error handler
            if (status >= 500) {
              const requestInfo = {
                ip: request.headers['x-real-ip'],
                requestId: request.headers['x-request-id'],
                url: request.url,
              };

              log.error({
                event: 'send-server-error',
                message: 'Page render error, switch to root boundary',
                error,
                requestInfo,
              });
            }

            reply.status(status);

            reply.header('Content-Type', 'text/html; charset=utf-8');
            reply.header('Content-Length', Buffer.byteLength(body, 'utf8'));
            reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');

            return body;
          } catch (e) {
            log.warn({ event: 'render-root-boundary-error', error: e });
          }
        };
      },
      deps: {
        RootErrorBoundary: { token: ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN, optional: true },
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      provide: MODERN_SATISFIES_TOKEN,
      useFactory: ({ requestManager, userAgent, cache }) => {
        const reqUserAgent = requestManager.getHeader('user-agent') as string;
        if (cache.has(reqUserAgent)) {
          return cache.get(reqUserAgent);
        }
        const result = satisfies(userAgent, null, { env: 'modern' });
        cache.set(reqUserAgent, result);
        return result;
      },
      deps: {
        requestManager: REQUEST_MANAGER_TOKEN,
        userAgent: USER_AGENT_TOKEN,
        cache: 'modernSatisfiesLruCache',
      },
    }),
    provide({
      provide: 'modernSatisfiesLruCache',
      scope: Scope.SINGLETON,
      useFactory: ({ createCache }) => {
        return createCache('memory', { max: 50 });
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
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
