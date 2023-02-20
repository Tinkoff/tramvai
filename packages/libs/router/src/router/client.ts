import { parse } from '@tinkoff/url';
import type { Options } from './abstract';
import { AbstractRouter } from './abstract';
import type { Navigation, NavigateOptions } from '../types';
import { isSameHost } from '../utils';
import { logger } from '../logger';
import { ClientHistory } from '../history/client';

export abstract class ClientRouter extends AbstractRouter {
  constructor(options: Options) {
    super(options);
    this.history = new ClientHistory();

    this.history.listen(async ({ type, url, navigateState, replace, history }) => {
      const currentUrl = this.getCurrentUrl();
      const { pathname, query } = this.resolveUrl({ url });
      const isSameUrlNavigation = currentUrl.pathname === pathname;

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
    // this flag for cases when we don't have initial router state from server - CSR fallback for example
    const fullRehydration = !navigation.to;

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

    if (fullRehydration) {
      await this.runHooks('beforeResolve', this.currentNavigation);

      const to = this.resolveRoute({ url }, { wildcard: true });

      this.currentNavigation.to = to;
    }

    // rerun guard check in case it differs from server side
    await this.runGuards(this.currentNavigation);

    // and init any history listeners
    this.history.init(this.currentNavigation);

    if (fullRehydration) {
      this.runSyncHooks('change', this.currentNavigation);
    }

    this.currentNavigation = null;

    // add dehydrated route to tree to prevent its loading
    if (!fullRehydration) {
      this.addRoute({
        name: navigation.to.name,
        path: navigation.to.path,
        config: navigation.to.config,
        // in case we have loaded page from some path-changing proxy
        // save this actual path as alias
        alias: url.pathname,
      });
    }
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
    }

    // prevent routing from any continues navigation returning promise which will be not resolved
    return new Promise<void>(() => {});
  }

  protected async block(navigation: Navigation) {
    return this.notfound(navigation);
  }

  protected async redirect(navigation: Navigation, target: NavigateOptions) {
    await super.redirect(navigation, target);

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
