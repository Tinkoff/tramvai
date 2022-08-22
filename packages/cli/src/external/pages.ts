import type { LazyComponentWrapper, PageComponent } from '@tramvai/react';

// eslint-disable-next-line import/no-default-export
export default {
  routes: {},
  pages: {},
} as {
  routes: Record<string, LazyComponentWrapper<PageComponent>>;
  pages: Record<string, LazyComponentWrapper<PageComponent>>;
};
