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
    // rerun guard check in case it differs from server side
    await this.runGuards(this.currentNavigation);

    // and init any history listeners
    this.history.init(this.currentNavigation);
    this.currentNavigation = null;

    // add dehydrated route to tree to prevent its loading
    if (navigation.to) {
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

    if (navigation.replace) {
      window.location.replace(navigation.url.href);
    } else {
      window.location.assign(navigation.url.href);
    }

    // prevent routing from any continues navigation returning promise which will be not resolved
    return new Promise<void>(() => {});
  }

  protected async block(navigation: Navigation) {
    return this.notfound(navigation);
  }

  protected async redirect(navigation: Navigation, target: NavigateOptions) {
    await super.redirect(navigation, target);

    return this.navigate({ ...target, replace: target.replace || navigation.replace });
  }
}
