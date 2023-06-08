import { provide } from '@tramvai/core';
import type { Provider } from '@tramvai/core';
import {
  PAGE_REGISTRY_TOKEN,
  PAGE_SERVICE_TOKEN,
  ROUTE_TRANSFORM_TOKEN,
  ROUTER_TOKEN,
} from '@tramvai/tokens-router';
import { EXTEND_RENDER } from '@tramvai/tokens-render';
import {
  ACTION_REGISTRY_TOKEN,
  BUNDLE_MANAGER_TOKEN,
  COMPONENT_REGISTRY_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  DISPATCHER_TOKEN,
} from '@tramvai/tokens-common';
import { routeTransformToken } from '../../tokens';
import { routeTransform } from './routeTransform';
import { routeSetDefaults } from './routeSetDefaults';
import { routeNormalize } from './routeNormalize';
import { provideRouter } from './render';
import { PageService } from './pageService';
import { PageRegistry } from './pageRegistry';

export const commonTokens: Provider[] = [
  provide({
    provide: routeTransformToken,
    useFactory: routeTransform,
    deps: {
      transformers: {
        token: ROUTE_TRANSFORM_TOKEN,
        optional: true,
      },
    },
  }),
  provide({
    provide: ROUTE_TRANSFORM_TOKEN,
    multi: true,
    useValue: routeSetDefaults,
  }),
  provide({
    provide: ROUTE_TRANSFORM_TOKEN,
    multi: true,
    useValue: routeNormalize,
  }),
  provide({
    provide: EXTEND_RENDER,
    multi: true,
    useFactory: provideRouter,
    deps: {
      router: ROUTER_TOKEN,
    },
  }),
  provide({
    provide: PAGE_SERVICE_TOKEN,
    useClass: PageService,
    deps: {
      router: ROUTER_TOKEN,
      componentRegistry: COMPONENT_REGISTRY_TOKEN,
    },
  }),
  provide({
    provide: PAGE_REGISTRY_TOKEN,
    useClass: PageRegistry,
    deps: {
      bundleManager: BUNDLE_MANAGER_TOKEN,
      pageService: PAGE_SERVICE_TOKEN,
      componentRegistry: COMPONENT_REGISTRY_TOKEN,
      actionRegistry: ACTION_REGISTRY_TOKEN,
      dispatcher: DISPATCHER_TOKEN,
      dispatcherContext: DISPATCHER_CONTEXT_TOKEN,
    },
  }),
];
