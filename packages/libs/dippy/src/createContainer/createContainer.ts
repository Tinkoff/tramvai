import { Container } from '../Container';
import type { Provider } from '../Provider';

export function createContainer(providers?: Provider[]) {
  return new Container(providers);
}
