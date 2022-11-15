import type { LazyComponentWrapper, NestedLayoutComponent, PageComponent } from '@tramvai/react';

// eslint-disable-next-line import/no-default-export
export default {
  routes: {},
  pages: {},
  layouts: {},
} as {
  routes: Record<string, LazyComponentWrapper<PageComponent>>;
  pages: Record<string, LazyComponentWrapper<PageComponent>>;
  layouts: Record<string, LazyComponentWrapper<NestedLayoutComponent>>;
};
