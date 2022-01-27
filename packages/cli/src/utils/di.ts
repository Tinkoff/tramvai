import type { Container, Provider } from '@tinkoff/dippy';

export const registerProviders = (di: Container, providers: readonly Provider[]) => {
  providers.forEach((provider) => di.register(provider));
};
