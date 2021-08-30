import { createToken } from '@tinkoff/dippy';
import type { NavigationHook, AbstractRouter, NavigationSyncHook, Route } from '@tinkoff/router';
import type { ROUTE_TRANSFORM_TOKEN } from '@tramvai/tokens-router';

export const routerClassToken = createToken<AbstractRouter>('router routerClassToken');
export const additionalRouterParameters = createToken<Record<string, any>>(
  'router additionalParameters'
);

export const onChangeHooksToken = createToken<NavigationSyncHook>('router onChangeHooks', {
  multi: true,
});
export const beforeResolveHooksToken = createToken<NavigationHook>('router beforeResolveHooks', {
  multi: true,
});
export const beforeNavigateHooksToken = createToken<NavigationHook>('router beforeNavigateHooks', {
  multi: true,
});
export const afterNavigateHooksToken = createToken<NavigationHook>('router afterNavigateHooks', {
  multi: true,
});
export const beforeUpdateCurrentHooksToken = createToken<NavigationHook>(
  'router beforeUpdateCurrentHooks',
  { multi: true }
);
export const afterUpdateCurrentHooksToken = createToken<NavigationHook>(
  'router afterUpdateCurrentHooks',
  { multi: true }
);

export const routeTransformToken = createToken<typeof ROUTE_TRANSFORM_TOKEN>(
  'router finalRouteTransform'
);

export const routerBundleInfoAdditionalToken = createToken<() => Promise<Route[]>>(
  'router bundleInfoAdditional'
);
