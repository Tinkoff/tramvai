import type { Provider, ScopeVariants, ProvideDepsIterator } from './Provider';

export interface RecordProvide<T> {
  factory: ((deps: ProvideDepsIterator<any>) => T) | undefined;
  multi: any[] | undefined;
  resolvedDeps: Record<string, Provider>;
  scope: ScopeVariants;
  stack?: string;
}
