import type { Provider } from './Provider';

// Исключительно для тайпчека переданного описания провайдера
export function provide<Deps, P = any>(descr: Provider<Deps, P>): Provider<Deps, P> {
  return descr;
}
