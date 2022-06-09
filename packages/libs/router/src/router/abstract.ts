import isString from '@tinkoff/utils/is/string';
import isObject from '@tinkoff/utils/is/object';
import type { Url } from '@tinkoff/url';
import { parse, convertRawUrl, rawParse, rawAssignUrl, rawResolveUrl } from '@tinkoff/url';
import type {
  Route,
  NavigateOptions,
  UpdateCurrentRouteOptions,
  Navigation,
  NavigationGuard,
  NavigationHook,
  NavigationSyncHook,
  HookName,
  Params,
  SyncHookName,
  HistoryOptions,
} from '../types';
import type { History } from '../history/base';
import type { RouteTree } from '../tree/tree';
import { makePath } from '../tree/utils';
import { logger } from '../logger';
import {
  makeNavigateOptions,
  registerHook,
  normalizeTrailingSlash,
  normalizeManySlashes,
  isSameHost,
} from '../utils';

export interface Options {
  trailingSlash?: boolean;
  mergeSlashes?: boolean;

  routes?: Route[];

  onRedirect?: NavigationHook;
  onNotFound?: NavigationHook;
  onBlock?: NavigationHook;

  beforeResolve?: NavigationHook[];
  beforeNavigate?: NavigationHook[];
  afterNavigate?: NavigationHook[];

  beforeUpdateCurrent?: NavigationHook[];
  afterUpdateCurrent?: NavigationHook[];

  guards?: NavigationGuard[];

  onChange?: NavigationSyncHook[];

  defaultRedirectCode?: number;
}

interface InternalOptions {
  history?: boolean;
}

export abstract class AbstractRouter {
  protected started = false;
  protected trailingSlash = false;
  protected strictTrailingSlash = true;

  protected mergeSlashes = false;

  protected currentNavigation: Navigation;
  protected lastNavigation: Navigation;

  protected history: History;
  protected tree?: RouteTree;

  protected guards: Set<NavigationGuard>;
  protected hooks: Map<HookName, Set<NavigationHook>>;
  protected syncHooks: Map<SyncHookName, Set<NavigationSyncHook>>;
  constructor({
    trailingSlash,
    mergeSlashes,
    beforeResolve = [],
    beforeNavigate = [],
    afterNavigate = [],
    beforeUpdateCurrent = [],
    afterUpdateCurrent = [],
    guards = [],
    onChange = [],
    onRedirect,
    onNotFound,
    onBlock,
  }: Options) {
    this.trailingSlash = trailingSlash ?? false;
    this.strictTrailingSlash = typeof trailingSlash === 'undefined';
    this.mergeSlashes = mergeSlashes ?? false;

    this.hooks = new Map([
      ['beforeResolve', new Set(beforeResolve)],
      ['beforeNavigate', new Set(beforeNavigate)],
      ['afterNavigate', new Set(afterNavigate)],
      ['beforeUpdateCurrent', new Set(beforeUpdateCurrent)],
      ['afterUpdateCurrent', new Set(afterUpdateCurrent)],
    ]);

    this.guards = new Set(guards);
    this.syncHooks = new Map([['change', new Set(onChange)]]);

    this.onRedirect = onRedirect;
    this.onNotFound = onNotFound;
    this.onBlock = onBlock;
  }

  protected onRedirect?: NavigationHook;

  protected onNotFound?: NavigationHook;

  protected onBlock?: NavigationHook;

  // start is using as marker that any preparation for proper work has done in the app
  // and now router can manage any navigations
  async start() {
    logger.debug({
      event: 'start',
    });

    this.started = true;
  }

  getCurrentRoute() {
    // when something will try to get currentRoute while navigating, it will get route which router currently navigating
    // in case some handler supposed to load data of route or similar
    return this.currentNavigation?.to ?? this.lastNavigation?.to;
  }

  getCurrentUrl() {
    // same as getCurrentRoute
    return this.currentNavigation?.url ?? this.lastNavigation?.url;
  }

  protected commitNavigation(navigation: Navigation) {
    logger.debug({
      event: 'commit-navigation',
      navigation,
    });

    if (!navigation.history) {
      // in case we came from history do not history back to prevent infinity recursive calls
      this.history.save(navigation);
    }

    this.runSyncHooks('change', navigation);

    this.lastNavigation = navigation;
    this.currentNavigation = null;
  }

  async updateCurrentRoute(updateRouteOptions: UpdateCurrentRouteOptions) {
    return this.internalUpdateCurrentRoute(updateRouteOptions, {});
  }

  protected async internalUpdateCurrentRoute(
    updateRouteOptions: UpdateCurrentRouteOptions,
    { history }: InternalOptions
  ) {
    const prevNavigation = this.currentNavigation ?? this.lastNavigation;

    if (!prevNavigation) {
      throw new Error('updateCurrentRoute should only be called after navigate to some route');
    }

    const { replace, params, navigateState } = updateRouteOptions;
    const { to: from, url: fromUrl } = prevNavigation;

    const navigation: Navigation = {
      type: 'updateCurrentRoute',
      from,
      to: this.resolveRoute({ params, navigateState }, { wildcard: true }),
      url: this.resolveUrl(updateRouteOptions),
      fromUrl,
      replace,
      history,
      navigateState,
      code: updateRouteOptions.code,
    };

    logger.debug({
      event: 'update-current-route',
      updateRouteOptions,
      navigation,
    });

    await this.run(navigation);
  }

  protected async runUpdateCurrentRoute(navigation: Navigation) {
    await this.runHooks('beforeUpdateCurrent', navigation);

    this.commitNavigation(navigation);

    await this.runHooks('afterUpdateCurrent', navigation);
  }

  async navigate(navigateOptions: NavigateOptions | string) {
    return this.internalNavigate(
      typeof navigateOptions === 'string' ? { url: navigateOptions } : navigateOptions,
      {}
    );
  }

  protected async internalNavigate(navigateOptions: NavigateOptions, { history }: InternalOptions) {
    const { url, replace, params, navigateState, code } = navigateOptions;
    const prevNavigation = this.currentNavigation ?? this.lastNavigation;

    if (!url && !prevNavigation) {
      throw new Error(
        'Navigate url should be specified and cannot be omitted for first navigation'
      );
    }

    const resolvedUrl = this.resolveUrl(navigateOptions);
    const { to: from, url: fromUrl } = prevNavigation ?? {};

    let navigation: Navigation = {
      type: 'navigate',
      from,
      url: resolvedUrl,
      fromUrl,
      replace,
      history,
      navigateState,
      code,
    };

    await this.runHooks('beforeResolve', navigation);

    const to = this.resolveRoute({ url: resolvedUrl, params, navigateState }, { wildcard: true });

    if (to) {
      navigation = {
        ...navigation,
        to,
      };
    }

    logger.debug({
      event: 'navigation',
      navigation,
    });

    if (!navigation.to) {
      return this.notfound(navigation);
    }

    await this.run(navigation);
  }

  protected async runNavigate(navigation: Navigation) {
    // check for redirect in new route description
    if (navigation.to.redirect) {
      return this.redirect(navigation, makeNavigateOptions(navigation.to.redirect));
    }

    await this.runGuards(navigation);

    await this.runHooks('beforeNavigate', navigation);

    this.commitNavigation(navigation);

    await this.runHooks('afterNavigate', navigation);
  }

  protected async run(navigation: Navigation) {
    this.currentNavigation = navigation;

    if (navigation.type === 'navigate') {
      await this.runNavigate(navigation);
    }

    if (navigation.type === 'updateCurrentRoute') {
      await this.runUpdateCurrentRoute(navigation);
    }
  }

  resolve(
    resolveOptions: NavigateOptions | string,
    options?: Parameters<AbstractRouter['resolveRoute']>[1]
  ) {
    const opts = typeof resolveOptions === 'string' ? { url: resolveOptions } : resolveOptions;

    return this.resolveRoute({ ...opts, url: parse(opts.url) }, options);
  }

  back(options?: HistoryOptions) {
    return this.go(-1, options);
  }

  forward() {
    return this.go(1);
  }

  async go(to: number, options?: HistoryOptions) {
    logger.debug({
      event: 'history.go',
      to,
    });

    return this.history.go(to, options);
  }

  isNavigating() {
    return !!this.currentNavigation;
  }

  async dehydrate(): Promise<Navigation> {
    throw new Error('Not implemented');
  }

  async rehydrate(navigation: Partial<Navigation>) {
    throw new Error('Not implemented');
  }

  addRoute(route: Route) {
    this.tree?.addRoute(route);
  }

  protected async redirect(navigation: Navigation, target: NavigateOptions): Promise<void> {
    logger.debug({
      event: 'redirect',
      navigation,
      target,
    });

    return this.onRedirect?.({
      ...navigation,
      from: navigation.to,
      fromUrl: navigation.url,
      to: null,
      url: this.resolveUrl(target),
    });
  }

  protected async notfound(navigation: Navigation): Promise<void> {
    logger.debug({
      event: 'not-found',
      navigation,
    });

    return this.onNotFound?.(navigation);
  }

  protected async block(navigation: Navigation): Promise<void> {
    logger.debug({
      event: 'blocked',
      navigation,
    });

    this.currentNavigation = null;

    if (this.onBlock) {
      return this.onBlock(navigation);
    }

    throw new Error('Navigation blocked');
  }

  protected normalizePathname(pathname?: string) {
    let normalized = pathname;

    if (this.mergeSlashes) {
      normalized = normalizeManySlashes(normalized);
    }

    if (!this.strictTrailingSlash) {
      normalized = normalizeTrailingSlash(normalized, this.trailingSlash);
    }

    return normalized;
  }

  protected resolveUrl({ url, query = {}, params, preserveQuery, hash }: NavigateOptions) {
    const currentRoute = this.getCurrentRoute();
    const currentUrl = this.getCurrentUrl();

    const resultUrl = url ? rawResolveUrl(currentUrl?.href ?? '', url) : rawParse(currentUrl.href);

    let { pathname } = resultUrl;

    if (params) {
      if (url) {
        pathname = makePath(resultUrl.pathname, params);
      } else if (currentRoute) {
        pathname = makePath(currentRoute.path, { ...currentRoute.params, ...params });
      }
    }

    if (isSameHost(resultUrl)) {
      pathname = this.normalizePathname(pathname);
    }

    return convertRawUrl(
      rawAssignUrl(resultUrl, {
        pathname,
        search: url ? resultUrl.search : '',
        query: {
          ...(preserveQuery ? this.getCurrentUrl().query : {}),
          ...query,
        },
        hash: hash ?? resultUrl.hash,
      })
    );
  }

  protected resolveRoute(
    { url, params, navigateState }: { url?: Url; params?: Params; navigateState?: any },
    { wildcard }: { wildcard?: boolean } = {}
  ) {
    let route = url ? this.tree?.getRoute(url.pathname) : this.getCurrentRoute();

    if (wildcard && !route && url) {
      // if ordinary route not found look for a wildcard route
      route = this.tree?.getWildcard(url.pathname);
    }

    if (!route) {
      return;
    }

    // if condition is true route data not changed, so no need to create new reference for route object
    if (!params && navigateState === route.navigateState) {
      return route;
    }

    return {
      ...route,
      params: { ...route.params, ...params },
      navigateState,
    };
  }

  protected async runGuards(navigation: Navigation) {
    logger.debug({
      event: 'guards.run',
      navigation,
    });

    if (!this.guards) {
      logger.debug({
        event: 'guards.empty',
        navigation,
      });
      return;
    }

    const results = await Promise.all(
      Array.from(this.guards).map((guard) =>
        Promise.resolve(guard(navigation)).catch((error) => {
          logger.warn({
            event: 'guard.error',
            error,
          });
        })
      )
    );

    logger.debug({
      event: 'guards.done',
      navigation,
      results,
    });

    for (const result of results) {
      if (result === false) {
        return this.block(navigation);
      }

      if (isString(result) || isObject(result)) {
        return this.redirect(navigation, makeNavigateOptions(result));
      }
    }
  }

  registerGuard(guard: NavigationGuard) {
    return registerHook(this.guards, guard);
  }

  protected runSyncHooks(hookName: SyncHookName, navigation: Navigation) {
    logger.debug({
      event: 'sync-hooks.run',
      hookName,
      navigation,
    });

    const hooks = this.syncHooks.get(hookName);

    if (!hooks) {
      logger.debug({
        event: 'sync-hooks.empty',
        hookName,
        navigation,
      });
      return;
    }

    for (const hook of hooks) {
      try {
        hook(navigation);
      } catch (error) {
        logger.warn({
          event: 'sync-hooks.error',
          error,
        });
      }
    }

    logger.debug({
      event: 'sync-hooks.done',
      hookName,
      navigation,
    });
  }

  registerSyncHook(hookName: SyncHookName, hook: NavigationSyncHook) {
    return registerHook(this.syncHooks.get(hookName), hook);
  }

  protected async runHooks(hookName: HookName, navigation: Navigation) {
    logger.debug({
      event: 'hooks.run',
      hookName,
      navigation,
    });

    const hooks = this.hooks.get(hookName);

    if (!hooks) {
      logger.debug({
        event: 'hooks.empty',
        hookName,
        navigation,
      });
      return;
    }

    await Promise.all(
      Array.from(hooks).map((hook) =>
        Promise.resolve(hook(navigation)).catch((error) => {
          logger.warn({
            event: 'hook.error',
            error,
          });

          // rethrow error for beforeResolve to prevent showing not found page
          // if app has problems while loading info about routes
          if (hookName === 'beforeResolve') {
            throw error;
          }
        })
      )
    );

    logger.debug({
      event: 'hooks.done',
      hookName,
      navigation,
    });
  }

  registerHook(hookName: HookName, hook: NavigationHook) {
    return registerHook(this.hooks.get(hookName), hook);
  }
}
