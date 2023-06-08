import identity from '@tinkoff/utils/function/identity';
import { createBundle } from '@tramvai/core';
import { __lazyErrorHandler } from '@tramvai/react';
import type { BUNDLE_MANAGER_TOKEN, LOGGER_TOKEN } from '@tramvai/tokens-common';
import type { Bundle, ExtractDependencyType } from '@tramvai/core';
import {
  fileSystemPagesEnabled,
  isFileSystemPageComponent,
  getAllFileSystemPages,
  getAllFileSystemLayouts,
  getAllFileSystemErrorBoundaries,
  fileSystemPageToLayoutKey,
  fileSystemPageToErrorBoundaryKey,
  getAllFileSystemWildcards,
} from '@tramvai/experiments';
import type { ComponentRegistry } from '../componentRegistry/componentRegistry';

type Interface = typeof BUNDLE_MANAGER_TOKEN;

const FS_PAGES_DEFAULT_BUNDLE = '__default';

type Deps = {
  bundleList: Record<string, () => Promise<{ default: Bundle }>>;
  componentRegistry: ComponentRegistry;
  logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
};

export class BundleManager implements Interface {
  bundles: Deps['bundleList'];

  componentRegistry: Deps['componentRegistry'];

  constructor({ bundleList, componentRegistry, logger }: Deps) {
    this.bundles = bundleList;
    this.componentRegistry = componentRegistry;

    if (fileSystemPagesEnabled()) {
      const log = logger('file-system-pages:bundle-manager');
      const components = getAllFileSystemPages();
      const layouts = getAllFileSystemLayouts();
      const errorBoundaries = getAllFileSystemErrorBoundaries();
      const wildcards = getAllFileSystemWildcards();

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
          ...getComponentsFor(wildcards, identity),
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
    return this.loadBundle(name, pageComponent).then(
      (bundle: { default: Bundle }) => bundle.default
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

  private loadBundle(name: string, pageComponent: string) {
    if (!this.has(name, pageComponent)) {
      return Promise.reject(new Error(`Bundle "${name}" not found`));
    }

    return this.bundles[name]().catch((e) => __lazyErrorHandler(e, this.bundles[name]));
  }
}
