import { ChildContainer } from '../ChildContainer';
import type { Container } from '../Container';
import type { Provider } from '../Provider';

export function createChildContainer(container: Container, providers?: Provider[]) {
  const childContainer = new ChildContainer(container);

  if (providers) {
    providers.forEach((provider) => {
      childContainer.register(provider);
    });
  }

  return childContainer;
}
