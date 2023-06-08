import isArray from '@tinkoff/utils/is/array';
import isObject from '@tinkoff/utils/is/object';
import eachObj from '@tinkoff/utils/object/each';
import type { Route } from '@tinkoff/router';
import type { PageRegistry as Interface, PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import type {
  COMPONENT_REGISTRY_TOKEN,
  ACTION_REGISTRY_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  DISPATCHER_TOKEN,
  BUNDLE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import type { TramvaiComponentDecl } from '@tramvai/react';
import { resolveLazyComponent } from '@tramvai/react';
import type { Bundle } from '@tramvai/core';

interface Deps {
  bundleManager: typeof BUNDLE_MANAGER_TOKEN;
  pageService: typeof PAGE_SERVICE_TOKEN;
  componentRegistry: typeof COMPONENT_REGISTRY_TOKEN;
  actionRegistry: typeof ACTION_REGISTRY_TOKEN;
  dispatcher: typeof DISPATCHER_TOKEN;
  dispatcherContext: typeof DISPATCHER_CONTEXT_TOKEN;
}

export class PageRegistry implements Interface {
  private bundleManager: Deps['bundleManager'];
  private pageService: Deps['pageService'];
  private componentRegistry: Deps['componentRegistry'];
  private actionRegistry: Deps['actionRegistry'];
  private dispatcher: Deps['dispatcher'];
  private dispatcherContext: Deps['dispatcherContext'];
  constructor({
    bundleManager,
    pageService,
    componentRegistry,
    actionRegistry,
    dispatcher,
    dispatcherContext,
  }: Deps) {
    this.bundleManager = bundleManager;
    this.pageService = pageService;
    this.componentRegistry = componentRegistry;
    this.actionRegistry = actionRegistry;
    this.dispatcher = dispatcher;
    this.dispatcherContext = dispatcherContext;
  }

  async resolve(route: Route): Promise<void> {
    const { bundle, pageComponent } = this.pageService.getConfig(route);
    const nestedLayoutComponent = this.pageService.resolveComponentFromConfig(
      'nestedLayout',
      route
    );

    const resolvedBundle = await this.bundleManager.get(bundle, pageComponent);

    // register bundle first to be able to load other components later
    await this.registerComponent(bundle, resolvedBundle);

    const resolvedPageComponent = resolvedBundle.components?.[pageComponent];

    // for file-system pages bundle is virtual, so it will be loaded in parallel with nested layout
    // for classic bundles, page component will be loaded after bundle loading
    const promises = [];

    if (resolvedPageComponent) {
      promises.push(this.registerComponent(pageComponent, resolvedPageComponent));
    }

    // TODO: maybe add the same logic for layoutComponent etc?
    if (nestedLayoutComponent) {
      promises.push(
        this.registerComponent(
          pageComponent,
          this.pageService.resolveComponentFromConfig('nestedLayout')
        )
      );
    }

    await Promise.all(promises);
  }

  private async registerComponent(group: string, componentOrBundle: TramvaiComponentDecl | Bundle) {
    // hoist static properties from inner component to lazy wrapper if any
    if ('load' in componentOrBundle) {
      await resolveLazyComponent(componentOrBundle);
    }

    if ('components' in componentOrBundle && isObject(componentOrBundle.components)) {
      eachObj((cmp, name: string) => {
        this.componentRegistry.add(name, cmp, group);
      }, componentOrBundle.components);
    }

    if ('actions' in componentOrBundle && isArray(componentOrBundle.actions)) {
      this.actionRegistry.add(group, componentOrBundle.actions);
    }

    if ('reducers' in componentOrBundle && isArray(componentOrBundle.reducers)) {
      componentOrBundle.reducers.forEach((reducer) => {
        this.dispatcher.registerStore(reducer);
        this.dispatcherContext.getStore(reducer);
      });
    }
  }
}
