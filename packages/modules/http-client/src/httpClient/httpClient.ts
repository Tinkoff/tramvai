import type { HTTP_CLIENT_FACTORY, HTTP_CLIENT } from '@tramvai/tokens-http-client';

export const createHttpClient = ({
  factory,
}: {
  factory: typeof HTTP_CLIENT_FACTORY;
}): typeof HTTP_CLIENT => {
  return factory({
    name: 'http-client',
    disableCache: true,
  });
};
