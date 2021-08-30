import type { ROUTE_TRANSFORM_TOKEN } from '@tramvai/tokens-router';

export const routeSetDefaults: typeof ROUTE_TRANSFORM_TOKEN = (route) => {
  const config = {
    bundle: 'mainDefault',
    pageComponent: 'pageDefault',
    ...route.config,
  };

  return {
    ...route,
    config,
  };
};
