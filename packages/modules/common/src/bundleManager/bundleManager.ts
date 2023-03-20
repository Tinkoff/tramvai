import eachObj from '@tinkoff/utils/object/each';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';
import { createBundle } from '@tramvai/core';
import { resolveLazyComponent, __lazyErrorHandler } from '@tramvai/react';
import type {
  BUNDLE_MANAGER_TOKEN,
  DISPATCHER_TOKEN,
  ActionsRegistry,
  LOGGER_TOKEN,
} from '@tramvai/tokens-common';
import type { Bundle, ExtractDependencyType } from '@tramvai/core';
import {
  fileSystemPagesEnabled,
  isFileSystemPageComponent,
  getAllFileSystemPages,
  getAllFileSystemLayouts,
  getAllFileSystemErrorBoundaries,
  fileSystemPageToLayoutKey,
  fileSystemPageToErrorBoundaryKey,
} from '@tramvai/experiments';
import type { ComponentRegistry } from '../componentRegistry/componentRegistry';

type Interface = typeof BUNDLE_MANAGER_TOKEN;

const FS_PAGES_DEFAULT_BUNDLE = '__default';

type Deps = {
  bundleList: Record<string, () => Promise<{ default: Bundle }>>;
  componentRegistry: ComponentRegistry;
  actionRegistry: ActionsRegistry;
  dispatcher: ExtractDependencyType<typeof DISPATCHER_TOKEN>;
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
};

export class BundleManager implements Interface {
  bundles: Deps['bundleList'];

  actionRegistry: Deps['actionRegistry'];

  componentRegistry: Deps['componentRegistry'];

  dispatcher: Deps['dispatcher'];

  constructor({ bundleList, componentRegistry, actionRegistry, dispatcher, logger }: Deps) {
    this.bundles = bundleList;
    this.componentRegistry = componentRegistry;
    this.actionRegistry = actionRegistry;
    this.dispatcher = dispatcher;

    if (fileSystemPagesEnabled()) {
      const log = logger('file-system-pages:bundle-manager');
      const components = getAllFileSystemPages();
      const layouts = getAllFileSystemLayouts();
      const errorBoundaries = getAllFileSystemErrorBoundaries();

      const getComponentsFor = (mapping: Record<any, any>, getKey: (name: string) => string) =>
        Object.keys(mapping).reduce<Record<string, any>>((result, key) => {
          // eslint-disable-next-line no-param-reassign
          result[getKey(key)] = mapping[key];
          return result;
        }, {});

      const componentsDefaultBundle = createBundle({
        name: FS_PAGES_DEFAULT_BUNDLE,
        components: {
          ...getComponentsFor(layouts, fileSystemPageToLayoutKey),
          ...getComponentsFor(errorBoundaries, fileSystemPageToErrorBoundaryKey),
          ...components,
        },
      });

      this.bundles[FS_PAGES_DEFAULT_BUNDLE] = () =>
        Promise.resolve({
          default: componentsDefaultBundle,
        });

      for (const key in componentsDefaultBundle.components) {
        this.componentRegistry.add(
          key,
          componentsDefaultBundle.components[key],
          FS_PAGES_DEFAULT_BUNDLE
        );
      }

      log.debug({
        event: 'create default bundle with file-system pages',
        components: Object.keys(components),
      });
    } else {
      this.bundles[FS_PAGES_DEFAULT_BUNDLE] = () =>
        Promise.resolve({
          default: createBundle({
            name: FS_PAGES_DEFAULT_BUNDLE,
            components: {},
          }),
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

      const component = await resolveLazyComponent(componentOrLoader);

      if (!component) {
        return;
      }

      // allow page components to register any other components
      if ('components' in component && isObject(component.components)) {
        eachObj((cmp, name: string) => {
          this.componentRegistry.add(name, cmp, pageComponent);
        }, component.components);
      }

      if ('actions' in component && isArray(component.actions)) {
        this.actionRegistry.add(pageComponent, component.actions);
      }

      if ('reducers' in component && isArray(component.reducers)) {
        component.reducers.forEach((reducer) => {
          this.dispatcher.registerStore(reducer);
        });
      }
    }

    eachObj((component, name) => {
      this.componentRegistry.add(name, component, bundle.name);
    }, bundle.components);

    if (bundle.actions) {
      this.actionRegistry.add(bundle.name, bundle.actions);
    }

    if (bundle.reducers) {
      bundle.reducers.forEach((reducer) => {
        this.dispatcher.registerStore(reducer);
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
