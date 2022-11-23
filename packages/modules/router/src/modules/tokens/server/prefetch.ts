import { provide } from '@tramvai/core';
import { LINK_PREFETCH_MANAGER_TOKEN } from '@tramvai/tokens-router';

// do nothing on server side
const prefetchManager = {
  prefetch: async (url: string) => {},
};

export const prefetchProviders = [
  provide({
    provide: LINK_PREFETCH_MANAGER_TOKEN,
    useValue: prefetchManager,
  }),
];
