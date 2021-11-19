import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * React components storage.
 * Components in the repository are divided into groups, e.g. you can specify a bundle or a page component as a group key.
 * The entity also allows you to get static component parameters through the `getComponentParam` method (will not work with `lazy` components)
 */
export const COMPONENT_REGISTRY_TOKEN = createToken<ComponentRegistry>('componentRegistry');

export interface ComponentRegistry {
  components: Record<string, any>;

  add(name: string, component: any, group?: string): void;

  get(name: string, group?: string): any;

  getComponentParam<T>(param: string, defaultValue: T, component: string, group?: string): T;
}
