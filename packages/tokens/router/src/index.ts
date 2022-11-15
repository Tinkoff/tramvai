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
  getConfig(): Route['config'];
  getContent(): Record<string, any>;
  getMeta(): { seo: Record<string, string>; analytics: Record<string, string> };

  navigate(options: string | NavigateOptions): Promise<void>;
  updateCurrentRoute(options: UpdateCurrentRouteOptions): Promise<void>;
  back(options?: HistoryOptions): Promise<void>;
  forward(): Promise<void>;
  go(to: number, options?: HistoryOptions): Promise<void>;

  addComponent(name: string, component: TramvaiComponent): void;
  getComponent(name: string): TramvaiComponent | undefined;

  resolveComponentFromConfig(property: PageServiceComponentType): TramvaiComponent | undefined;
}

export type RouteResolve = (navigation: Navigation) => Promise<Route | void>;

export type RouteTransform = (route: Route) => Route;
