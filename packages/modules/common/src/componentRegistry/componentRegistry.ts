import pathOr from '@tinkoff/utils/object/pathOr';
import flatten from '@tinkoff/utils/array/flatten';
import type { COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';

type Interface = typeof COMPONENT_REGISTRY_TOKEN;

const DEFAULT_BUNDLE = '__default';

export class ComponentRegistry implements Interface {
  components: Record<string, any>;

  constructor({ componentList }: { componentList?: Record<string, any>[] } = {}) {
    this.components = {
      [DEFAULT_BUNDLE]: Object.assign({}, ...flatten(componentList ?? [])),
    };
  }

  add(name: string, component: any, bundle = DEFAULT_BUNDLE) {
    const bundleComponents = this.components[bundle] || {};

    bundleComponents[name] = component;
    this.components[bundle] = bundleComponents;
  }

  get(name: string, bundle = DEFAULT_BUNDLE) {
    const bundleComponents = this.components[bundle] || {};

    return bundleComponents[name] || this.components[DEFAULT_BUNDLE][name];
  }

  getComponentParam<T>(param: string, defaultValue: T, component: string, bundle: string): T {
    return pathOr([param], defaultValue, this.get(component, bundle));
  }
}
