import type { CollectorInterface } from './types';

export { Package, CollectorInterface } from './types';

export function getCollectorBy(collector: string | CollectorInterface) {
  const Collector: CollectorInterface =
    typeof collector === 'string' ? require(collector).Collector : collector;

  return Collector;
}
