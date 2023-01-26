import { commandLineListTokens, declareModule, provide } from '@tramvai/core';
import { COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';
import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT } from './tokens';

// default internal bundle, used for File-System components
const FALLBACK_GROUP = '__default';
// just some unic name
const FALLBACK_NAME = '__csr_fallback__';
// just some unic path
const FALLBACK_PATH = '/__csr_fallback__/';

const FALLBACK_ROUTE = {
  name: FALLBACK_NAME,
  path: FALLBACK_PATH,
  config: {
    bundle: FALLBACK_GROUP,
    pageComponent: FALLBACK_NAME,
  },
};

/**
 * Module for force CSR mode, only connected when `@tramvai/cli` commands run with `--csr` flag
 */
export const ForceCSRModule = declareModule({
  name: 'ForceCSRModule',
  providers: [
    // set CSR mode globally
    provide({
      provide: TRAMVAI_RENDER_MODE,
      useValue: 'client',
    }),
    // register CSR fallback component
    provide({
      provide: commandLineListTokens.listen,
      useFactory: ({ componentRegistry, fallback }) => {
        return function addCSRFallbackCompnent() {
          componentRegistry.add(FALLBACK_NAME, fallback, FALLBACK_GROUP);
        };
      },
      deps: {
        componentRegistry: COMPONENT_REGISTRY_TOKEN,
        fallback: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
      },
    }),
    // add CSR fallback route
    provide({
      provide: commandLineListTokens.customerStart,
      useFactory: ({ router }) => {
        return function addCSRFallbackRoute() {
          router.registerHook('beforeResolve', async () => {
            router.addRoute(FALLBACK_ROUTE);
          });
        };
      },
      deps: {
        router: ROUTER_TOKEN,
      },
    }),
    // tramvai static will not generate CSR fallback if /bundleInfo is not contains this route
    {
      provide: 'router bundleInfoAdditional',
      useValue: () => FALLBACK_ROUTE,
    },
  ],
});
