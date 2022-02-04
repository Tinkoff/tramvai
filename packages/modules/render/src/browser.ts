import { Module, commandLineListTokens, DI_TOKEN, provide } from '@tramvai/core';
import { LOGGER_TOKEN, CONTEXT_TOKEN, STORE_TOKEN } from '@tramvai/module-common';
import {
  EXTEND_RENDER,
  CUSTOM_RENDER,
  RESOURCES_REGISTRY,
  RENDER_MODE,
  RENDERER_CALLBACK,
} from '@tramvai/tokens-render';
import { PAGE_SERVICE_TOKEN, ROUTER_TOKEN } from '@tramvai/tokens-router';
import { rendering as renderInBrowser } from './client';
import type { RenderModuleConfig } from './shared/types';
import { LayoutModule } from './shared/LayoutModule';
import { providers as sharedProviders } from './shared/providers';
import { PageErrorStore, setPageErrorEvent } from './shared/pageErrorStore';

export * from './shared/pageErrorStore';
export * from '@tramvai/tokens-render';

export const DEFAULT_POLYFILL_CONDITION = '';

const throwErrorInDev = (logger: typeof LOGGER_TOKEN) => {
  if (process.env.NODE_ENV === 'development') {
    logger.error(`${RESOURCES_REGISTRY} следует использовать только при SSR`);
  }
};

@Module({
  imports: [LayoutModule],
  providers: [
    ...sharedProviders,
    provide({
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory: ({ router, store }) => {
        return function clearPageError() {
          router.registerHook('beforeResolve', async () => {
            if (store.getState(PageErrorStore)) {
              store.dispatch(setPageErrorEvent(null));
            }
          });
        };
      },
      deps: {
        router: ROUTER_TOKEN,
        store: STORE_TOKEN,
      },
    }),
    provide({
      provide: RESOURCES_REGISTRY,
      useFactory: ({ logger }: { logger: typeof LOGGER_TOKEN }) => ({
        getPageResources: () => {
          throwErrorInDev(logger);
          return [];
        },
        register: () => throwErrorInDev(logger),
      }),
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.generatePage,
      useFactory: (deps) => {
        return function renderClientCommand() {
          (window as any).contextExternal = deps.consumerContext;

          return Promise.resolve(renderInBrowser(deps as any));
        };
      },
      deps: {
        pageService: PAGE_SERVICE_TOKEN,
        log: LOGGER_TOKEN,
        customRender: { token: CUSTOM_RENDER, optional: true },
        extendRender: { token: EXTEND_RENDER, optional: true },
        rendererCallback: { token: RENDERER_CALLBACK, optional: true },
        consumerContext: CONTEXT_TOKEN,
        di: DI_TOKEN,
        mode: RENDER_MODE,
      },
      multi: true,
    }),
    provide({
      provide: RENDER_MODE,
      useValue: 'legacy',
    }),
  ],
})
export class RenderModule {
  static forRoot({ mode }: RenderModuleConfig) {
    const providers = [];

    if (typeof mode === 'string') {
      providers.push({
        provide: RENDER_MODE,
        useValue: mode,
      });
    }

    return {
      mainModule: RenderModule,
      providers,
    };
  }
}
