import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Хранилище react-компонентов.
 * Хранилище разделено на бандлы, поэтому при задании\получении компонента нужно указывать ключ компонента и название бандла.
 * Также сущность позволяет получать статические параметры компонентов через метод _getComponentParam_
 */
export const COMPONENT_REGISTRY_TOKEN = createToken<ComponentRegistry>('componentRegistry');

export interface ComponentRegistry {
  components: Record<string, any>;

  add(name: string, component: any, bundle?: string): void;

  get(name: string, bundle?: string): any;

  getComponentParam<T>(param: string, defaultValue: T, component: string, bundle?: string): T;
}
