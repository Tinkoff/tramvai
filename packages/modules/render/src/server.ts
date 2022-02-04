import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import type { Request, Response } from 'express';
import { Module, commandLineListTokens, DI_TOKEN, provide } from '@tramvai/core';
import {
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
  CONTEXT_TOKEN,
  CREATE_CACHE_TOKEN,
} from '@tramvai/module-common';
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
} from '@tramvai/tokens-render';
import { Scope } from '@tinkoff/dippy';
import { WEB_APP_AFTER_INIT_TOKEN } from '@tramvai/tokens-server';
import { ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN } from '@tramvai/react';
import { parse } from '@tinkoff/url';
import { RESOURCE_INLINER, RESOURCES_REGISTRY_CACHE, ResourcesInliner } from './resourcesInliner';
import { ResourcesRegistry } from './resourcesRegistry';
import { PageBuilder } from './server/PageBuilder';
import { htmlPageSchemaFactory } from './server/htmlPageSchema';
import { ReactRenderServer } from './server/ReactRenderServer';
import type { RenderModuleConfig } from './shared/types';
import { LayoutModule } from './shared/LayoutModule';
import { providers as sharedProviders } from './shared/providers';
import { PageErrorStore, setPageErrorEvent } from './shared/pageErrorStore';

export * from './shared/pageErrorStore';
export * from '@tramvai/tokens-render';

export const DEFAULT_POLYFILL_CONDITION =
  '!window.Promise.prototype.finally || !window.URL || !window.URLSearchParams || !window.AbortController || !window.IntersectionObserver || !Object.fromEntries';

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
        const thirtyMinutes = 1000 * 60 * 30;
        return {
          filesCache: createCache('memory', { max: 50, maxAge: thirtyMinutes }),
          sizeCache: createCache('memory', { max: 100, maxAge: thirtyMinutes }),
          requestsCache: createCache('memory', { max: 150, maxAge: 1000 * 60 * 5 }),
          disabledUrlsCache: createCache('memory', { max: 150, maxAge: 1000 * 60 * 5 }),
        };
      },
      deps: {
        createCache: CREATE_CACHE_TOKEN,
      },
    }),
    provide({
      provide: RESOURCE_INLINER,
      useClass: ResourcesInliner,
      deps: {
        resourcesRegistryCache: RESOURCES_REGISTRY_CACHE,
        resourceInlineThreshold: { token: RESOURCE_INLINE_OPTIONS, optional: true },
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
            const requestInfo = {
              ip: requestManager.getClientIp(),
              requestId: requestManager.getHeader('x-request-id'),
              url: requestManager.getUrl(),
            };

            log.error({ event: 'page-render-error', error, requestInfo });

            // Assuming that there was an error when rendering the page, try to render again with ErrorBoundary
            context.dispatch(setPageErrorEvent(error));
            html = await htmlBuilder.flow();
          }

          const pageRenderError = context.getState(PageErrorStore);

          if (pageRenderError) {
            const status = pageRenderError.status || pageRenderError.httpStatus || 500;
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
        userAgent: USER_AGENT_TOKEN,
        htmlAttrs: HTML_ATTRS,
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
      // Включаем инлайнинг CSS-файлов размером до 40кб (до gzip) по умолчанию.
      provide: RESOURCE_INLINE_OPTIONS,
      useValue: {
        threshold: 40960, // 40kb before gzip, +-10kb after gzip
        types: [ResourceType.style],
      },
    }),
    provide({
      provide: WEB_APP_AFTER_INIT_TOKEN,
      multi: true,
      useFactory: ({ RootErrorBoundary, logger }) => {
        const log = logger('module-render:error-handler');

        return (app) => {
          app.use((err, req: Request, res: Response, next) => {
            if (!RootErrorBoundary) {
              return next(err);
            }

            let body: string;

            try {
              log.info({ event: 'render-root-boundary' });

              body = renderToString(
                createElement(RootErrorBoundary, { error: err, url: parse(req.url) })
              );

              res.status(err.httpStatus || err.status || 500);

              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

              return res.send(body);
            } catch (e) {
              log.warn({ event: 'render-root-boundary-error', error: e });

              return next(err);
            }
          });
        };
      },
      deps: {
        RootErrorBoundary: { token: ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN, optional: true },
        logger: LOGGER_TOKEN,
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
