import type { Provider } from '@tinkoff/dippy';
import { createContainer } from '@tinkoff/dippy';

export const initRootContainer = (providers: Provider[] = []) => {
  return createContainer(providers);
};
