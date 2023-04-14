import { parse } from '@tinkoff/url';
import type { Options } from './abstract';
import { AbstractRouter } from './abstract';
import type { Navigation, NavigateOptions } from '../types';
import { isSameHost, makeNavigateOptions } from '../utils';
import { logger } from '../logger';
import { ClientHistory } from '../history/client';

export abstract class ClientRouter extends AbstractRouter {
  // this flag for cases when we don't have initial router state from server - CSR fallback initialization
  protected fullRehydrationInProcess: boolean = null;

  constructor(options: Options) {
    super(options);
    this.history = new ClientHistory();

    this.history.listen(async ({ type, url, navigateState, replace, history }) => {
      const currentUrl = this.getCurrentUrl();
      const { pathname, query } = this.resolveUrl({ url });
      const isSameUrlNavigation =
        (currentUrl ? currentUrl.pathname : window.location.pathname) === pathname;
      const isUpdateCurrentRoute = type === 'updateCurrentRoute' || (!type && isSameUrlNavigation);

      //
      // When history was changed before rehydration, we need to pass this change if url is the same,
      // because current route will be the same with any of this type changes, and while rehydration fresh url will be used.
      // Another case is navigation, and it is okay to run `internalNavigate`, because we support this case before rehydration.
      //
      // @todo: find a better solution. We can monkeypatch window.history later, in `history.init` method,
      // but it can lead to inconsistent state between current route and page url, if updated url is not the same.
      //
      if (isUpdateCurrentRoute && !currentUrl) {
        if (replace) {
          (window.history as any).__originalHistory.replaceState(navigateState, '', url);
        } else {
          (window.history as any).__originalHistory.pushState(navigateState, '', url);
        }
        return;
      }

      if (type === 'updateCurrentRoute' || (!type && isSameUrlNavigation)) {
        const route = this.tree?.getRoute(pathname);

        await this.internalUpdateCurrentRoute(
          {
            params: route?.params,
            query,
            replace,
            navigateState,
          },
          { history }
        );
      } else {
        await this.internalNavigate(
          {
            url,
            replace,
            navigateState,
          },
          { history }
        );
      }
    });
  }

  async rehydrate(navigation: Navigation) {
    this.fullRehydrationInProcess = !navigation.to;

    logger.debug({
      event: 'rehydrate',
      navigation,
    });

    const url = parse(window.location.href);

    this.currentNavigation = {
      ...navigation,
      type: 'navigate',
      url,
    };
    this.lastNavigation = this.currentNavigation;

    if (this.fullRehydrationInProcess) {
      await this.runHooks('beforeResolve', this.currentNavigation);

      const to = this.resolveRoute({ url }, { wildcard: true });
      const redirect = to?.redirect;

      this.currentNavigation.to = to;

      if (redirect) {
        return this.redirect(this.currentNavigation, makeNavigateOptions(redirect));
      }
    }

    // rerun guard check in case it differs from server side
    await this.runGuards(this.currentNavigation);

    // and init any history listeners
    this.history.init(this.currentNavigation);

    if (this.fullRehydrationInProcess) {
      this.runSyncHooks('change', this.currentNavigation);
    }

    this.currentNavigation = null;

    // add dehydrated route to tree to prevent its loading
    if (!this.fullRehydrationInProcess) {
      this.addRoute({
        name: navigation.to.name,
        path: navigation.to.path,
        config: navigation.to.config,
        // in case we have loaded page from some path-changing proxy
        // save this actual path as alias
        alias: url.pathname,
      });
    }

    this.fullRehydrationInProcess = null;
  }

  protected resolveRoute(...options: Parameters<AbstractRouter['resolveRoute']>) {
    const { url } = options[0];

    // navigation for other hosts should be considered as external navigation
    if (url && !isSameHost(url)) {
      return;
    }

    return super.resolveRoute(...options);
  }

  protected async notfound(navigation: Navigation) {
    await super.notfound(navigation);
    // in case we didn't find any matched route just force hard page navigation

    const prevUrl = navigation.fromUrl?.href ?? window.location.href;
    const nextUrl = navigation.url.href;
    const isNoSpaNavigation = navigation.from && !navigation.to;

    // prevent redirect cycle on the same page,
    // except cases when we run no-spa navigations,
    // because we need hard reload in this cases
    if (isNoSpaNavigation ? true : prevUrl !== nextUrl) {
      if (navigation.replace) {
        window.location.replace(nextUrl);
      } else {
        window.location.assign(nextUrl);
      }
    } else if (this.onBlock) {
      // last resort case for CSR fallback
      return this.onBlock(navigation);
    }

    // prevent routing from any continues navigation returning promise which will be not resolved
    return new Promise<void>(() => {});
  }

  protected async block(navigation: Navigation) {
    return this.notfound(navigation);
  }

  protected async redirect(navigation: Navigation, target: NavigateOptions) {
    await super.redirect(navigation, target);

    // on CSR fallback initialization, if we found a redirect,
    // we need to make hard reload for prevent current page rendering
    if (this.fullRehydrationInProcess) {
      window.location.replace(target.url);

      // prevent routing from any continues navigation returning promise which will be not resolved
      return new Promise<void>(() => {});
    }

    return this.internalNavigate(
      {
        ...target,
        replace: target.replace || navigation.replace,
      },
      {
        redirect: true,
      }
    );
  }
}
