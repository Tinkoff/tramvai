import flatten from '@tinkoff/utils/array/flatten';
import type { AbstractRouter } from '@tinkoff/router';
import { getDiWrapper } from '@tramvai/test-helpers';
import { createMockRouter } from '@tramvai/test-mocks';
import { ROUTER_GUARD_TOKEN, ROUTER_TOKEN } from '@tramvai/tokens-router';

type Options = Parameters<typeof getDiWrapper>[0] & { router?: AbstractRouter };

export const testGuard = (options: Options) => {
  const { modules, providers = [], router = createMockRouter() } = options;
  const { di } = getDiWrapper({
    di: options.di,
    modules,
    providers: [
      ...providers,
      {
        provide: ROUTER_TOKEN,
        useValue: router,
      },
    ],
  });

  const guards = flatten<typeof ROUTER_GUARD_TOKEN>(
    di.get({ token: ROUTER_GUARD_TOKEN, multi: true })
  );

  guards.forEach((guard) => router.registerGuard(guard));

  return {
    router,
    di,
  };
};
