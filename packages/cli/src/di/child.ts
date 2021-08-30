import type { Container, Provider } from '@tinkoff/dippy';
import { createChildContainer } from '@tinkoff/dippy';

export const initChildContainer = (rootContainer: Container, providers?: readonly Provider[]) => {
  const container = createChildContainer(rootContainer);

  providers?.forEach((item) => {
    return container.register(item);
  });

  return container;
};
