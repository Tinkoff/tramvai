import { commandLineListTokens, createApp, provide } from '@tramvai/core';
import { COOKIE_MANAGER_TOKEN, CommonModule } from '@tramvai/module-common';
import { PAGE_SERVICE_TOKEN, SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { ErrorInterceptorModule } from '@tramvai/module-error-interceptor';
import { SeoModule } from '@tramvai/module-seo';
import {
  DEFAULT_HEADER_COMPONENT,
  DEFAULT_FOOTER_COMPONENT,
  RENDER_SLOTS,
  ResourceType,
  ResourceSlot,
  TRAMVAI_RENDER_MODE,
} from '@tramvai/tokens-render';
import {
  PageRenderModeModule,
  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
  PAGE_RENDER_WRAPPER_TYPE,
} from '@tramvai/module-page-render-mode';

import { Header } from './components/features/Header/Header';
import { Footer } from './components/features/Footer/Footer';
import { DefaultFallback } from './components/DefaultFallback';

createApp({
  name: 'page-render-mode',
  modules: [
    CommonModule,
    SpaRouterModule,
    RenderModule.forRoot({ useStrictMode: true }),
    SeoModule,
    ServerModule,
    ErrorInterceptorModule,
    PageRenderModeModule,
  ],
  providers: [
    {
      provide: DEFAULT_HEADER_COMPONENT,
      useValue: Header,
    },
    {
      provide: DEFAULT_FOOTER_COMPONENT,
      useValue: Footer,
    },
    {
      provide: RENDER_SLOTS,
      multi: true,
      useValue: {
        type: ResourceType.asIs,
        slot: ResourceSlot.HEAD_META,
        payload: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      },
    },
    {
      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
      useValue: DefaultFallback,
    },
    {
      provide: PAGE_RENDER_WRAPPER_TYPE,
      useValue: 'page',
    },
    {
      provide: TRAMVAI_RENDER_MODE,
      useFactory: ({ cookieManager }) => {
        return cookieManager.get('test-auth-client') === 'true' ? 'client' : 'ssr';
      },
      deps: {
        cookieManager: COOKIE_MANAGER_TOKEN,
      },
    },
    // delay client hydration for auth-client page
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      useFactory: ({ pageService }) => {
        return async () => {
          if (
            typeof window !== 'undefined' &&
            pageService.getCurrentRoute().actualPath === '/auth-client/'
          ) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        };
      },
      deps: {
        pageService: PAGE_SERVICE_TOKEN,
      },
    }),
  ],
});
