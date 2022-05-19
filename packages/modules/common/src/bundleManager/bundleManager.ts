import eachObj from '@tinkoff/utils/object/each';
import { createBundle } from '@tramvai/core';
import { __lazyErrorHandler } from '@tramvai/react';
import type {
  BUNDLE_MANAGER_TOKEN,
  DISPATCHER_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
  ActionsRegistry,
} from '@tramvai/tokens-common';
import type { Bundle } from '@tramvai/core';
import {
  fileSystemPagesEnabled,
  isFileSystemPageComponent,
  getAllFileSystemPages,
} from '@tramvai/experiments';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type { ComponentRegistry } from '../componentRegistry/componentRegistry';

type Interface = typeof BUNDLE_MANAGER_TOKEN;

const FS_PAGES_DEFAULT_BUNDLE = '__default';

export class BundleManager implements Interface {
  bundles: Record<string, () => Promise<{ default: Bundle }>>;

  actionRegistry: ActionsRegistry;

  componentRegistry: ComponentRegistry;

  dispatcher: typeof DISPATCHER_TOKEN;

  dispatcherContext: typeof DISPATCHER_CONTEXT_TOKEN;

  constructor({
    bundleList,
    componentRegistry,
    actionRegistry,
    dispatcher,
    dispatcherContext,
    logger,
  }) {
    this.bundles = bundleList;
    this.componentRegistry = componentRegistry;
    this.actionRegistry = actionRegistry;
    this.dispatcher = dispatcher;
    this.dispatcherContext = dispatcherContext;

    if (fileSystemPagesEnabled()) {
      const log = logger('file-system-pages:bundle-manager');
      const components = getAllFileSystemPages();

      const componentsDefaultBundle = createBundle({
        name: FS_PAGES_DEFAULT_BUNDLE,
        components,
      });

      this.bundles[FS_PAGES_DEFAULT_BUNDLE] = () =>
        Promise.resolve({
          default: componentsDefaultBundle,
        });

      log.info({
        event: 'create default bundle with file-system pages',
        components: Object.keys(components),
      });
    }
  }

  get(name: string, pageComponent: string) {
    // use fake bundle with file-system pages
    if (isFileSystemPageComponent(pageComponent)) {
      // eslint-disable-next-line no-param-reassign
      name = FS_PAGES_DEFAULT_BUNDLE;
    }
    return this.loadBundle(name, pageComponent).then((bundle: { default: Bundle }) =>
      this.resolve(bundle.default, pageComponent)
    );
  }

  has(name: string, pageComponent: string) {
    // use fake bundle with file-system pages
    if (isFileSystemPageComponent(pageComponent)) {
      // eslint-disable-next-line no-param-reassign
      name = FS_PAGES_DEFAULT_BUNDLE;
    }
    return !!this.bundles[name];
  }

  private async resolve(bundle: Bundle, pageComponent: string) {
    // preload `lazy` components then register actions and reducers
    if (pageComponent && bundle.components[pageComponent]) {
      const componentOrLoader = bundle.components[pageComponent];

      const component =
        typeof componentOrLoader.load === 'function'
          ? (await componentOrLoader.load()).default
          : componentOrLoader;

      // manually hoist static properties from preloaded component to loadable wrapper,
      // this open access to current page component static properties outside before rendering
      if (componentOrLoader !== component) {
        hoistNonReactStatics(componentOrLoader, component);
      }

      // allow page components to register any other components
      if (component.components) {
        eachObj((cmp, name: string) => {
          this.componentRegistry.add(name, cmp, pageComponent);
        }, component.components);
      }

      if (component.actions) {
        this.actionRegistry.add(pageComponent, component.actions);
      }

      if (component.reducers) {
        component.reducers.forEach((reducer) => {
          this.dispatcher.registerStore(reducer);
          this.dispatcherContext.getStore(reducer);
        });
      }
    }

    eachObj((component, name: string) => {
      this.componentRegistry.add(name, component, bundle.name);
    }, bundle.components);

    if (bundle.actions) {
      this.actionRegistry.add(bundle.name, bundle.actions);
    }

    if (bundle.reducers) {
      bundle.reducers.forEach((reducer) => {
        this.dispatcher.registerStore(reducer);
        this.dispatcherContext.getStore(reducer);
      });
    }

    return bundle;
  }

  private loadBundle(name: string, pageComponent: string) {
    if (!this.has(name, pageComponent)) {
      return Promise.reject(new Error(`Bundle "${name}" not found`));
    }

    return this.bundles[name]().catch((e) => __lazyErrorHandler(e, this.bundles[name]));
  }
}
