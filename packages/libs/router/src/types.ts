import type { Url, Query } from '@tinkoff/url';

export type Params = Record<string, string>;

export interface Route {
  name: string;
  path: string;
  redirect?: string | NavigateOptions;
  alias?: string;
  config?: Record<string, any>;
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
