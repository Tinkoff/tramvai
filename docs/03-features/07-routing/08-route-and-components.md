---
id: route-and-components
title: Route and Components
---

This section describes routes and components relations.

## Page structure

For all application routes, you can specify the list of components names that will be rendered on this route. This list can contain only components keys, whereas according React components will be automatically resolved from special service - `ComponentRegistry`.

List of possible components:

- `pageComponent` - component with [page content](03-features/03-pages.md#page-component)
- `nestedLayoutComponent` - component with [page layout](03-features/04-layouts.md#nested-layout)
- `errorBoundaryComponent` - component with [page error boundary](03-features/05-error-boundaries.md#page-error-boundary)
- `layoutComponent` - component with [root layout](03-features/04-layouts.md#root-layout)

Page structure with all components looks like this, simplified:

```tsx
const Root = () => (
  <LayoutComponent>
    <Header />
    <NestedLayoutComponent>
      <ErrorBoundaryComponent>
        <PageComponent />
      </ErrorBoundaryComponent>
    </NestedLayoutComponent>
    <Footer />
  </LayoutComponent>
);
```

## File-System Routing

For FS routes, route with list of components will be created automatically, and all components will be automatically registered in `ComponentRegistry`.

For example, from this file structure:

```
src
└── routes
    ├── index.tsx
    ├── _layout.tsx
    └── _error.tsx
```

This route will be created:

```ts
[{
  path: '/',
  config: {
    pageComponent: '@/routes/index',
    nestedLayoutComponent: '@/routes/index__layout',
    errorBoundaryComponent: '@/routes/index__errorBoundary',
  },
}];
```

## Manually created routes

For manually created routes, you need to use `pages` directory, all components from this directory will be automatically registered in `ComponentRegistry`.

Example file structure:

```
src
└── pages
    ├── main.tsx
    ├── main-layout.tsx
    └── main-error.tsx
```

And you can create this route with all of this components:

```ts
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'main',
      path: '/',
      config: {
        pageComponent: '@/pages/main',
        nestedLayoutComponent: '@/pages/main-layout',
        errorBoundaryComponent: '@/pages/main-error',
      },
    }]),
  ],
});
```

## Default components

For all components can be specified default component, e.g. that keys will be used if component with specified in route config key is not found in `ComponentRegistry`:

```ts
const mapping = {
  pageComponent: 'pageDefault',
  nestedLayoutComponent: 'nestedLayoutDefault',
  errorBoundaryComponent: 'errorBoundaryDefault',
  layoutComponent: 'layoutDefault',
}
```

Default Root Layout already provided by token `DEFAULT_LAYOUT_COMPONENT`, this is default [application layout](03-features/04-layouts.md#root-layout) and it is not recommended to change it.

Default Page Error Boundary can be provided by token [`DEFAULT_ERROR_BOUNDARY_COMPONENT`](03-features/05-error-boundaries.md#default-fallback).

Default Page Nested Layout is not supported for FS routes or pages and is not necessary, because Root [`LAYOUT_OPTIONS`](03-features/04-layouts.md#components-and-wrappers) is more powerful mechanism - `wrappers.page` is complete alternative for nested layout in page components hierarchy.

Default Page Component is not supported for FS routes or pages, only for [legacy bundles](#bundles-legacy).

## Bundles (legacy)

:::caution

Bundles is legacy feature, and it is recommended to use File-System routing in new projects.

:::

For [bundles](concepts/bundle.md) situation is more complicated, because bundles can group several components, and different routes can use the same bundle. Also, it means that for bundles additional level of default components will be used.

Important default for routes if bundles is used, is default bundle and page component keys:

```ts
const routeConfig = {
  bundle: 'mainDefault',
  pageComponent: 'pageDefault',
};
```

It means that all routes without FS routing will use `mainDefault` bundle, and get `pageDefault` page component from this bundle. Example of this default bundle:

```ts title="bundles/mainDefault.ts"
import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

export const mainDefault = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: lazy(() => import('../components/main-page')),
  },
});
```

And for this simple route, `components/main-page.tsx` page component will be rendered:

```ts
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'main',
      path: '/',
    }]),
  ],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault'),
  },
});
```

All other default components will applied to route with this bundle, e.g.:

```ts title="bundles/mainDefault.ts"
import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

export const mainDefault = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: lazy(() => import('../components/main-page')),
    // highlight-next-line
    nestedLayoutDefault: lazy(() => import('../components/main-layout')),
    // highlight-next-line
    errorBoundaryDefault: lazy(() => import('../components/main-error')),
    // highlight-next-line
    layoutDefault: lazy(() => import('../components/layout')),
  },
});
```

Defaults from [Defaults components](#default-components) section also will be applied, but with lower priority.

In summary:

- If `pageComponent`, `layoutComponent`, `nestedLayoutComponent` or `errorBoundaryComponent` properties is specified in route config, they values will be used as components keys
- Otherwise, `pageDefault`, `layoutDefault`, `nestedLayoutDefault` or `errorBoundaryDefault` will be used as components keys
- Then, if current bundle components has component with this key, it will be used
- Otherwise, `tramvai` will try to find this keys in default components
- Only for Page Component, if it is not found anywhere, 500 error will be thrown
