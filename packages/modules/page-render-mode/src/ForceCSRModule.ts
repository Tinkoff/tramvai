import { commandLineListTokens, declareModule, provide } from '@tramvai/core';
import {
  COMPONENT_REGISTRY_TOKEN,
  ENV_USED_TOKEN,
  ENV_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT } from './tokens';

// default internal bundle, used for File-System components
const FALLBACK_GROUP = '__default';
// just some unic name
const FALLBACK_NAME = '__csr_fallback__';
// just some unic path
const FALLBACK_PATH = '/__csr_fallback__/';
// env for force CSR mode
const FORCE_RENDER_ENV_KEY = 'TRAMVAI_FORCE_CLIENT_SIDE_RENDERING';

const FALLBACK_ROUTE = {
  name: FALLBACK_NAME,
  path: FALLBACK_PATH,
  config: {
    bundle: FALLBACK_GROUP,
    pageComponent: FALLBACK_NAME,
  },
};

/**
 * Module for force CSR mode, only add logic when `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true` env variable is set
 */
export const ForceCSRModule = declareModule({
  name: 'ForceCSRModule',
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      useValue: [{ key: FORCE_RENDER_ENV_KEY, optional: true }],
    }),
    // set CSR mode globally
    provide({
      provide: TRAMVAI_RENDER_MODE,
      useFactory: ({ envManager }) =>
        envManager.get(FORCE_RENDER_ENV_KEY) === 'true' ? 'client' : 'ssr',
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    // register CSR fallback component
    provide({
      provide: commandLineListTokens.listen,
      useFactory: ({ componentRegistry, fallback, envManager }) => {
        return function addCSRFallbackCompnent() {
          if (envManager.get(FORCE_RENDER_ENV_KEY) === 'true') {
            componentRegistry.add(FALLBACK_NAME, fallback, FALLBACK_GROUP);
          }
        };
      },
      deps: {
        componentRegistry: COMPONENT_REGISTRY_TOKEN,
        fallback: { token: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT, optional: true },
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    // add CSR fallback route
    provide({
      provide: commandLineListTokens.customerStart,
      useFactory: ({ router, envManager }) => {
        return function addCSRFallbackRoute() {
          if (envManager.get(FORCE_RENDER_ENV_KEY) === 'true') {
            router.registerHook('beforeResolve', async () => {
              router.addRoute(FALLBACK_ROUTE);
            });
          }
        };
      },
      deps: {
        router: ROUTER_TOKEN,
        envManager: ENV_MANAGER_TOKEN,
      },
    }),
    // tramvai static will not generate CSR fallback if /bundleInfo is not contains this route
    {
      provide: 'router bundleInfoAdditional',
      useFactory:
        ({ envManager }) =>
        () =>
          envManager.get(FORCE_RENDER_ENV_KEY) === 'true' ? FALLBACK_ROUTE : null,
      deps: {
        envManager: ENV_MANAGER_TOKEN,
      },
    },
  ],
});
