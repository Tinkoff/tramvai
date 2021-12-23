import type { Provider } from '@tramvai/core';
import { REQUEST_MANAGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
import { additionalRouterParameters, routeTransformToken } from '../../tokens';
import { routerOptions } from './routerOptions';
import { bundleInfo } from './bundleInfo';

export const serverTokens: Provider[] = [
  {
    provide: additionalRouterParameters,
    useFactory: routerOptions,
    deps: {
      requestManager: REQUEST_MANAGER_TOKEN,
      responseManager: RESPONSE_MANAGER_TOKEN,
    },
  },
  {
    provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
    multi: true,
    useFactory: bundleInfo,
    deps: {
      routes: {
        token: ROUTES_TOKEN,
        optional: true,
      },
      routeTransform: routeTransformToken,
    },
  },
];
