import flatten from '@tinkoff/utils/array/flatten';
import prop from '@tinkoff/utils/object/prop';

import { createPapiMethod } from '@tramvai/papi';
import type { ROUTES_TOKEN } from '@tramvai/tokens-router';
import type { routeTransformToken } from '../../tokens';
import { routerBundleInfoAdditionalToken } from '../../tokens';

const deduplicateArray = <T>(list: T[]): T[] => {
  return Array.from(new Set(list));
};

export const bundleInfo = ({
  routes,
  routeTransform,
}: {
  routes?: Array<typeof ROUTES_TOKEN>;
  routeTransform: typeof routeTransformToken;
}) => {
  return createPapiMethod({
    method: 'get',
    path: '/bundleInfo',
    async handler(deps) {
      const loadAdditional = deps.getAdditionalRoutes ?? (() => []);

      return deduplicateArray(
        flatten(routes || [])
          .concat((await loadAdditional()) ?? [])
          .map(routeTransform)
          .map(prop('path'))
          .sort()
      );
    },
    deps: {
      getAdditionalRoutes: { token: routerBundleInfoAdditionalToken, optional: true },
    },
  });
};
