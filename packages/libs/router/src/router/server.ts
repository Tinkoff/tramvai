import { isInvalidUrl } from '@tinkoff/url';
import type { Options } from './abstract';
import { AbstractRouter } from './abstract';
import { ServerHistory } from '../history/server';
import type { Navigation, NavigateOptions, HookName } from '../types';
import { RouteTree } from '../tree/tree';
import { logger } from '../logger';

export class Router extends AbstractRouter {
  protected defaultRedirectCode: number;
  protected blocked = false;
  protected redirectCode?: number;
  constructor(options: Options) {
    super(options);
    this.tree = new RouteTree(options.routes);
    this.defaultRedirectCode = options.defaultRedirectCode ?? 308;

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

  protected async internalNavigate(navigateOptions: NavigateOptions, internalOptions) {
    // any navigation after initial should be considered as redirects
    if (this.getCurrentRoute()) {
      return this.redirect(this.lastNavigation, navigateOptions);
    }

    return super.internalNavigate(navigateOptions, internalOptions);
  }

  protected async run(navigation: Navigation) {
    if (this.redirectCode) {
      return this.redirect(navigation, { url: navigation.url.href, code: this.redirectCode });
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
      this.redirectCode = this.defaultRedirectCode;
    }

    return normalized;
  }

  protected resolveUrl(options: NavigateOptions) {
    if (options.url && isInvalidUrl(options.url)) {
      this.redirectCode = this.defaultRedirectCode;
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
