import pathOr from '@tinkoff/utils/object/pathOr';
import flatten from '@tinkoff/utils/array/flatten';
import type { COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';

type Interface = typeof COMPONENT_REGISTRY_TOKEN;

const DEFAULT_GROUP = '__default';

export class ComponentRegistry implements Interface {
  components: Record<string, any>;

  constructor({ componentList }: { componentList?: Record<string, any>[] } = {}) {
    this.components = {
      [DEFAULT_GROUP]: Object.assign({}, ...flatten(componentList ?? [])),
    };
  }

  add(name: string, component: any, group = DEFAULT_GROUP) {
    const groupComponents = this.components[group] || {};

    groupComponents[name] = component;
    this.components[group] = groupComponents;
  }

  get(name: string, group = DEFAULT_GROUP) {
    const groupComponents = this.components[group] || {};

    return groupComponents[name] || this.components[DEFAULT_GROUP][name];
  }

  getComponentParam<T>(param: string, defaultValue: T, component: string, group: string): T {
    return pathOr([param], defaultValue, this.get(component, group));
  }
}
