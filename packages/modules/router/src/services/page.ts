import type { Url } from '@tinkoff/url';
import type {
  Router,
  NavigationRoute,
  NavigateOptions,
  UpdateCurrentRouteOptions,
  HistoryOptions,
} from '@tinkoff/router';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

type PageServiceInterface = typeof PAGE_SERVICE_TOKEN;

export class PageService implements PageServiceInterface {
  private router: Router;

  constructor({ router }) {
    this.router = router;
  }

  getCurrentRoute(): NavigationRoute {
    return this.router.getCurrentRoute();
  }

  getCurrentUrl(): Url {
    return this.router.getCurrentUrl();
  }

  getConfig(): Record<string, any> {
    return this.getCurrentRoute()?.config ?? {};
  }

  getContent(): Record<string, any> {
    return this.getConfig().content ?? {};
  }

  getMeta() {
    return this.getConfig().meta ?? {};
  }

  navigate(options: NavigateOptions | string): Promise<void> {
    return this.router.navigate(options);
  }

  updateCurrentRoute(options: UpdateCurrentRouteOptions): Promise<void> {
    return this.router.updateCurrentRoute(options);
  }

  back(options?: HistoryOptions): Promise<void> {
    return this.router.back(options);
  }

  forward(): Promise<void> {
    return this.router.forward();
  }

  go(to: number, options?: HistoryOptions): Promise<void> {
    return this.router.go(to, options);
  }
}
