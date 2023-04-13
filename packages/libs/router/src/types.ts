import type { Url, Query } from '@tinkoff/url';

export type Params = Record<string, string>;

export interface RouteConfig {
  [key: string]: any;
}

export interface Route {
  name: string;
  path: string;
  redirect?: string | NavigateOptions;
  // TODO: alias purpose in unclear. Seems like it isn't used
  // in the router code actually, but the alias field
  // is used in router-extension-dco just as a marker for dynamic route
  alias?: string;
  config?: RouteConfig;
}

export interface NavigationRoute extends Route {
  actualPath: string;
  params: Params;
  navigateState?: any;
}

export interface BaseNavigateOptions {
  params?: Partial<Params>;
  query?: Partial<Query>;
  preserveQuery?: boolean;
  replace?: boolean;
  hash?: string;
  navigateState?: any;
  code?: number;
}

export interface NavigateOptions extends BaseNavigateOptions {
  url?: string;
}

export type UpdateCurrentRouteOptions = BaseNavigateOptions;

export interface HistoryOptions {
  historyFallback: string;
}

export type NavigationType = 'navigate' | 'updateCurrentRoute';

export interface Navigation {
  type: NavigationType;
  from?: NavigationRoute;
  to?: NavigationRoute;
  fromUrl?: Url;
  url?: Url;
  replace?: boolean;
  navigateState?: any;
  history?: boolean;
  cancelled?: boolean;
  code?: number;

  redirect?: boolean;

  redirectFrom?: NavigationRoute;
}

export type NavigationGuard = (
  navigation: Navigation
) => Promise<void | NavigateOptions | string | boolean>;

export type NavigationHook = (navigation: Navigation) => Promise<void>;

export type NavigationSyncHook = (navigation: Navigation) => void;

export type HookName =
  | 'beforeResolve'
  | 'beforeNavigate'
  | 'afterNavigate'
  | 'beforeUpdateCurrent'
  | 'afterUpdateCurrent';

export type SyncHookName = 'change';
