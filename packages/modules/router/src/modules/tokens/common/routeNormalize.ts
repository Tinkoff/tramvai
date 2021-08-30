import replace from '@tinkoff/utils/string/replace';
import type { ROUTE_TRANSFORM_TOKEN } from '@tramvai/tokens-router';

export const routeNormalize: typeof ROUTE_TRANSFORM_TOKEN = (route) => {
  return {
    ...route,
    path: replace(/\/?$/, '/', route.path),
  };
};
