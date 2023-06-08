import type { Url } from '@tinkoff/url';
import type {
  Router,
  NavigationRoute,
  NavigateOptions,
  UpdateCurrentRouteOptions,
  HistoryOptions,
  Route,
} from '@tinkoff/router';
import type { COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';
import type { TramvaiComponent } from '@tramvai/react';
import type { PageServiceComponentType, PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
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

  getConfig(route: Route = this.getCurrentRoute()): Record<string, any> {
    return route?.config ?? {};
  }

  getContent(route?: Route): Record<string, any> {
    return this.getConfig(route).content ?? {};
  }

  getMeta(route?: Route) {
    return this.getConfig(route).meta ?? {};
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

  addComponent(name: string, component: TramvaiComponent, route?: Route): void {
    const group = this.getComponentsGroupName(route);
    return this.componentRegistry.add(name, component, group);
  }

  getComponent(name: string, route?: Route): TramvaiComponent | undefined {
    const group = this.getComponentsGroupName(route);
    return this.componentRegistry.get(name, group);
  }

  resolveComponentFromConfig(property: PageServiceComponentType, route?: Route) {
    const configName = `${property}Component`;
    const defaultComponent = `${property}Default`;

    const componentName = this.getConfig(route)[configName] ?? defaultComponent;

    return this.getComponent(componentName, route) || this.getComponent(defaultComponent, route);
  }

  private getComponentsGroupName(route?: Route): string {
    const { bundle, pageComponent } = this.getConfig(route);
    const group = isFileSystemPageComponent(pageComponent) ? pageComponent : bundle;

    return group;
  }
}
