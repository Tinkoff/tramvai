import type { Url } from '@tinkoff/url';
import type {
  Router,
  NavigationRoute,
  NavigateOptions,
  UpdateCurrentRouteOptions,
  HistoryOptions,
} from '@tinkoff/router';
import type { COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { isFileSystemPageComponent } from '@tramvai/experiments';

type PageServiceInterface = typeof PAGE_SERVICE_TOKEN;

export class PageService implements PageServiceInterface {
  private router: Router;
  private componentRegistry: typeof COMPONENT_REGISTRY_TOKEN;

  constructor({ router, componentRegistry }) {
    this.router = router;
    this.componentRegistry = componentRegistry;
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

  addComponent(name: string, component: any): void {
    const group = this.getComponentsGroupName();
    return this.componentRegistry.add(name, component, group);
  }

  getComponent(name: string): any {
    const group = this.getComponentsGroupName();
    return this.componentRegistry.get(name, group);
  }

  private getComponentsGroupName(): string {
    const { bundle, pageComponent } = this.getConfig();
    const group = isFileSystemPageComponent(pageComponent) ? pageComponent : bundle;

    return group;
  }
}
