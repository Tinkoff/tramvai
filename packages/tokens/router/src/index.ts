import { createToken } from '@tinkoff/dippy';
import type {
  AbstractRouter,
  NavigationGuard,
  Route,
  Navigation,
  NavigationRoute,
  NavigateOptions,
  UpdateCurrentRouteOptions,
  HistoryOptions,
} from '@tinkoff/router';
import type { TramvaiComponent } from '@tramvai/react';

/**
 * @description
 * Token to access the router instance
 */
export const ROUTER_TOKEN = createToken<AbstractRouter>('router router');

/**
 * @description
 * Token for defining static routes
 */
export const ROUTES_TOKEN = createToken<Route | Route[]>('router routes', { multi: true });
/**
 * @description
 * Token for providing guard handlers for page transitions
 */
export const ROUTER_GUARD_TOKEN = createToken<NavigationGuard>('router guard', { multi: true });

/**
 * @description
 * Encapsulates the logic of working with the router - contains methods for getting the configuration of the route and performing navigation
 */
export const PAGE_SERVICE_TOKEN = createToken<PageService>('router pageService');

/**
 * @description
 * Managers registration for additions related to pages and bundles
 */
export const PAGE_REGISTRY_TOKEN = createToken<PageRegistry>('router pageRegistry');

/**
 * @description
 * Hook to resolve route dynamically
 */
export const ROUTE_RESOLVE_TOKEN = createToken<RouteResolve>('router routeResolve');

/**
 * @description
 * Hook to transform route config
 */
export const ROUTE_TRANSFORM_TOKEN = createToken<RouteTransform>('router routeTransform', {
  multi: true,
});

/**
 * @description
 * Flag for SPA-transitions, indicating that actions must be executed before or after a route update in the stor
 */
export const ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN = createToken<'before' | 'after'>(
  'router spaRunMode'
);

export const LINK_PREFETCH_MANAGER_TOKEN =
  createToken<LinkPrefetchManager>('link prefetch manager');

export const LINK_PREFETCH_HANDLER_TOKEN = createToken<(route: Route) => Promise<void>>(
  'link prefetch handler',
  { multi: true }
);

export const ROUTER_MODE_TOKEN = createToken<'spa' | 'no-spa'>('router mode');

export type PageServiceComponentType =
  | 'page'
  | 'layout'
  | 'nestedLayout'
  | 'header'
  | 'footer'
  | 'errorBoundary';

export interface PageService {
  getCurrentRoute(): NavigationRoute;
  getCurrentUrl(): ReturnType<AbstractRouter['getCurrentUrl']>;
  getConfig(route?: Route): Route['config'];
  getContent(route?: Route): Record<string, any>;
  getMeta(route?: Route): { seo: Record<string, string>; analytics: Record<string, string> };

  navigate(options: string | NavigateOptions): Promise<void>;
  updateCurrentRoute(options: UpdateCurrentRouteOptions): Promise<void>;
  back(options?: HistoryOptions): Promise<void>;
  forward(): Promise<void>;
  go(to: number, options?: HistoryOptions): Promise<void>;

  addComponent(name: string, component: TramvaiComponent, route?: Route): void;
  getComponent(name: string, route?: Route): TramvaiComponent | undefined;

  resolveComponentFromConfig(
    property: PageServiceComponentType,
    route?: Route
  ): TramvaiComponent | undefined;
}

export interface PageRegistry {
  resolve(route: Route): Promise<void>;
}

export type RouteResolve = (navigation: Navigation) => Promise<Route | void>;

export type RouteTransform = (route: Route) => Route;

export interface LinkPrefetchManager {
  prefetch(url: string): Promise<void>;
}
