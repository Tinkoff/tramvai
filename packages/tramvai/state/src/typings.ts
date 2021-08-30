import type { DispatcherContext } from './dispatcher/dispatcherContext';

export interface StoreClass {
  handlers: Record<string, Function | string>;
  storeName: string;
  // TODO: убрать после того отпадёт надобность связывать сторы router и application
  dependencies?: Array<StoreClass | string | { store: StoreClass | string; optional: true }>;
  new (dispatcher: DispatcherContext<any>['dispatcherInterface']): any;
}

export type StoreInstance = InstanceType<StoreClass>;
