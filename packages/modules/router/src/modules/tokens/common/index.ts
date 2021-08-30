import type { Provider } from '@tramvai/core';
import { ROUTE_TRANSFORM_TOKEN, ROUTER_TOKEN } from '@tramvai/tokens-router';
import { EXTEND_RENDER } from '@tramvai/tokens-render';
import { routeTransformToken } from '../../tokens';
import { routeTransform } from './routeTransform';
import { routeSetDefaults } from './routeSetDefaults';
import { routeNormalize } from './routeNormalize';
import { provideRouter } from './render';

export const commonTokens: Provider[] = [
  {
    provide: routeTransformToken,
    useFactory: routeTransform,
    deps: {
      transformers: {
        token: ROUTE_TRANSFORM_TOKEN,
        optional: true,
      },
    },
  },
  {
    provide: ROUTE_TRANSFORM_TOKEN,
    multi: true,
    useValue: routeSetDefaults,
  },
  {
    provide: ROUTE_TRANSFORM_TOKEN,
    multi: true,
    useValue: routeNormalize,
  },
  {
    provide: EXTEND_RENDER,
    multi: true,
    useFactory: provideRouter,
    deps: {
      router: ROUTER_TOKEN,
    },
  },
];
