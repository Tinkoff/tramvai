import { isInvalidUrl } from '@tinkoff/url';
import type { Options } from './abstract';
import { AbstractRouter } from './abstract';
import { ServerHistory } from '../history/server';
import type { Navigation, NavigateOptions, HookName, NavigationHook } from '../types';
import { RouteTree } from '../tree/tree';
import { logger } from '../logger';

export class Router extends AbstractRouter {
  protected blocked = false;
  protected redirectCode?: number;
  constructor(
    options: Options & {
      onRedirect: (navigation: Navigation) => Promise<void>;
      onNotFound: NavigationHook;
      onBlock: NavigationHook;
    }
  ) {
    super(options);
    this.tree = new RouteTree(options.routes);

    this.history = new ServerHistory();
  }

  protected onRedirect: (navigation: Navigation) => Promise<void>;

  async dehydrate() {
    logger.debug({
      event: 'dehydrate',
      navigation: this.lastNavigation,
    });
    return this.lastNavigation;
  }

  protected async run(navigation: Navigation) {
    if (this.redirectCode) {
      return this.redirect(navigation, { url: navigation.url.path, code: this.redirectCode });
    }

    // any navigation after initial should be considered as redirects
    if (this.getCurrentRoute()) {
      return this.redirect(navigation, { url: navigation.url.path, code: navigation.code });
    }

    await super.run(navigation);
  }

  protected async redirect(navigation: Navigation, target: NavigateOptions) {
    logger.debug({
      event: 'redirect',
      navigation,
      target,
    });

    this.blocked = true;

    return this.onRedirect({
      ...navigation,
      from: navigation.to,
      fromUrl: navigation.url,
      to: null,
      url: this.resolveUrl(target),
      code: target.code,
    });
  }

  protected async notfound(navigation: Navigation) {
    this.blocked = true;

    return super.notfound(navigation);
  }

  protected normalizePathname(pathname: string) {
    const normalized = super.normalizePathname(pathname);

    if (normalized !== pathname) {
      this.redirectCode = 308;
    }

    return normalized;
  }

  protected resolveUrl(options: NavigateOptions) {
    if (options.url && isInvalidUrl(options.url)) {
      this.redirectCode = 308;
    }

    return super.resolveUrl(options);
  }

  protected async runHooks(hookName: HookName, navigation: Navigation) {
    // do not run hooks if another parallel navigation has been called
    if (this.blocked) {
      return;
    }

    return super.runHooks(hookName, navigation);
  }

  protected async runGuards(navigation: Navigation) {
    // do not run guards if another parallel navigation has been called
    if (this.blocked) {
      return;
    }

    return super.runGuards(navigation);
  }
}
