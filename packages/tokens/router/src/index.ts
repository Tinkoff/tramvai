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

/**
 * @description
 * Токен для доступа к объекту роутера
 */
export const ROUTER_TOKEN = createToken<AbstractRouter>('router router');

/**
 * @description
 * Токен для определения статичных роутов
 */
export const ROUTES_TOKEN = createToken<Route>('router routes', { multi: true });
/**
 * @description
 * Токен для передачи guard-обработчиков для роутов при переходах
 */
export const ROUTER_GUARD_TOKEN = createToken<NavigationGuard>('router guard', { multi: true });

/**
 * @description
 * Инкапсулирует логику работы с роутером - содержит методы для получения конфига роута и выполнения навигации
 */
export const PAGE_SERVICE_TOKEN = createToken<PageService>('router pageService');

/**
 * @description
 * Хук для разрешения роута динамически
 */
export const ROUTE_RESOLVE_TOKEN = createToken<RouteResolve>('router routeResolve');

/**
 * @description
 * Токен для трансформации конфига роута
 */
export const ROUTE_TRANSFORM_TOKEN = createToken<RouteTransform>('router routeTransform', {
  multi: true,
});

/**
 * @description
 * Флаг для спа-переходов, указывающий что экшены должны выполняться до или после обновления роута в сторе
 */
export const ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN = createToken<'before' | 'after'>(
  'router spaRunMode'
);

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
}

export type RouteResolve = (navigation: Navigation) => Promise<Route | void>;

export type RouteTransform = (route: Route) => Route;
