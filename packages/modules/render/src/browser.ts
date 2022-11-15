import { Module, commandLineListTokens, DI_TOKEN, provide } from '@tramvai/core';
import { LOGGER_TOKEN, CONTEXT_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';
import {
  EXTEND_RENDER,
  CUSTOM_RENDER,
  RESOURCES_REGISTRY,
  RENDER_MODE,
  RENDERER_CALLBACK,
  USE_REACT_STRICT_MODE,
} from '@tramvai/tokens-render';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
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
          return renderInBrowser(deps);
        };
      },
      deps: {
        logger: LOGGER_TOKEN,
        customRender: { token: CUSTOM_RENDER, optional: true },
        extendRender: { token: EXTEND_RENDER, optional: true },
        rendererCallback: { token: RENDERER_CALLBACK, optional: true },
        consumerContext: CONTEXT_TOKEN,
        di: DI_TOKEN,
        useStrictMode: USE_REACT_STRICT_MODE,
      },
      multi: true,
    }),
    provide({
      provide: USE_REACT_STRICT_MODE,
      useFactory: ({ deprecatedMode }) => {
        if (deprecatedMode === 'strict') {
          return true;
        }
        return false;
      },
      deps: {
        deprecatedMode: RENDER_MODE,
      },
    }),
    provide({
      provide: RENDER_MODE,
      useValue: 'legacy',
    }),
  ],
})
export class RenderModule {
  static forRoot({ mode, useStrictMode }: RenderModuleConfig) {
    const providers = [];

    if (typeof mode === 'string' || typeof useStrictMode === 'boolean') {
      providers.push({
        provide: USE_REACT_STRICT_MODE,
        useValue: useStrictMode ?? mode === 'strict',
      });
    }

    return {
      mainModule: RenderModule,
      providers,
    };
  }
}
