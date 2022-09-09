import flatten from '@tinkoff/utils/array/flatten';
import prop from '@tinkoff/utils/object/prop';

import { createPapiMethod } from '@tramvai/papi';
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
import { isWildcard, isHistoryFallback } from '@tinkoff/router';
import { routeTransformToken } from '../../tokens';
import { routerBundleInfoAdditionalToken } from '../../tokens';

const deduplicateArray = <T>(list: T[]): T[] => {
  return Array.from(new Set(list));
};

export const bundleInfoPapi = createPapiMethod({
  method: 'get',
  path: '/bundleInfo',
  async handler() {
    const { getAdditionalRoutes, routes, routeTransform } = this.deps;

    const loadAdditional = getAdditionalRoutes ?? (() => []);
    return deduplicateArray(
      flatten(routes || [])
        .concat((await loadAdditional()) ?? [])
        .map(routeTransform)
        .map(prop('path'))
        .filter((path) => !isWildcard(path) && !isHistoryFallback(path))
        .sort()
    );
  },
  deps: {
    routes: {
      token: ROUTES_TOKEN,
      optional: true,
    },
    routeTransform: routeTransformToken,
    getAdditionalRoutes: { token: routerBundleInfoAdditionalToken, optional: true },
  },
});
