---
id: layouts
title: Layouts
---

Every pages may have a two levels of layouts:
- Root Layout (global)
- Nested Layout (page level)

## Root Layout

This layout is global for every application page. By default, only current page component will be rendered, but you can easily add `Header`, `Footer` or any global components.

:::tip

Use Root Layout features, when you need to add some HTML tags globally to all application Pages.

:::

### Structure

Layout has the following structure:

```tsx
<LayoutWrapper>
  {globalComponents}
  <ContentWrapper>
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
    <PageWrapper>{page}</PageWrapper>
    <FooterWrapper>
      <Footer />
    </FooterWrapper>
  </ContentWrapper>
</LayoutWrapper>
```

Any of the wrappers could be customized. By default, every wrapper just renders passed `children` prop, but `HeaderWrapper` and `FooterWrapper` render only if components `Header` and `Footer` were passed as props to result layout.

#### Components

- `header`, `footer`, `layout`, `content`, `page` are base components for wrappers. They should render passed prop `children`. By default, `layout`, `content`, `page` are "render children" while `header` and `footer` are "render prop"
- any of the other components are, so called, `globalComponents`. They are just rendered as components inside `LayoutWrapper`

#### Wrappers

[HOC](https://ru.reactjs.org/docs/higher-order-components.html) for `components`

- `header`, `footer`, `layout`, `content`, `page` - HOC for the base components
- all of the other components are HOCs for все остальные wrappers - HOC for corresponding `globalComponents`

It is possible to pass a list of HOCs. This way order of render wrapping for passed component will be from end to start of the list.

Such wrappers and used for:

- hide/show elements by condition
- set additional css style for components
- inject additional code/handler
- pass additional props

Example of such wrapper:

```tsx
function layoutWrapper(WrappedComponent) {
  return (props) => (
    <div className="ui-layout">
      <WrappedComponent {...props} />
    </div>
  );
}
```

### Header and Footer

You can register header and footer components through providers:

```tsx
import { DEFAULT_HEADER_COMPONENT, DEFAULT_FOOTER_COMPONENT } from '@tramvai/tokens-render';
import { provide } from '@tramvai/core';

createApp({
  providers: [
    provide({
      provide: DEFAULT_HEADER_COMPONENT,
      useValue: DefaultHeader,
    }),
    provide({
      provide: DEFAULT_FOOTER_COMPONENT,
      useValue: DefaultFooter,
    }),
  ],
});
```

### Components and Wrappers

You can add custom components and wrappers for layout via the token `LAYOUT_OPTIONS`, this wrappers also will be applied on every application page:

```tsx
import { LAYOUT_OPTIONS } from '@tramvai/tokens-render';
import { provide } from '@tramvai/core';

createApp({
  providers: [
    provide({
      provide: LAYOUT_OPTIONS,
      useValue: {
        // React components
        components: {
          // global layout component
          layout: Layout,
          // custom global component
          feedback: Feedback,
        },
        // HOC's for components
        wrappers: {
          // wrapper for global layout component
          layout: layoutWrapper,
          // wrappers for global Feedback component
          feedback: [feedbackWrapper1, feedbackWrapper2],
        },
      },
    }),
  ],
});
```

### Replace Root Layout

:::caution

We are strongly recommend to always use a default Root Layout, because some of `tramvai` core functionality depends on it.

:::

If the basic layout doesn't work for you, you can replace it with any other React component. In doing so, you need to implement all the wrappers yourself and plug in global components if you need them.

You can add a `layoutComponent` property to route `config` property when adding routes manually (this feature is not supported with File-System Routing). This layout will be rendered when you go to the corresponding route.

First, create a new component:

```tsx title="pages/custom-layout.tsx"
import type { LayoutComponent } from '@tramvai/react';

const CustomLayout: LayoutComponent = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default CustomLayout;
```

`LayoutComponent` interface is used here for better typings.

And register this component as `layoutComponent` property for some application route, e.g.:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'main',
      path: '/',
      config: {
        pageComponent: '@/pages/index',
        layoutComponent: '@/pages/custom-layout',
      },
    }]),
  ],
});
```

## Nested Layout

For every page, unique nested layout can be applied. It is useful when you need to wrap group of pages in the same block, or add the same actions.

:::tip

Use Nested Layout, when you need to add the same HTML tags to a few or more Pages.

:::

:::note

For now, only one level of layout nesting supported, and simplified component structure will look like this:

```tsx
<RootLayout>
  <NestedLayout>
    <Page />
  </NestedLayout>
</RootLayout>
```

:::

Nested layout it is a simple React component with `children` property:

```tsx
import type { NestedLayoutComponent } from '@tramvai/react';

const Layout: NestedLayoutComponent = ({ children }) => {
  return <div>{children}</div>;
};
```

`NestedLayoutComponent` interface is used here for better typings - Nested Layout components may have additional static properties:

### Actions

Nested Layout components support [global actions](concepts/action.md#global-actions) in `actions` static property, these actions will executed only for pages with this layout:

```tsx
Layout.actions = [fetchSomeDataAction];
```

This actions will be code-splitted with layout component code.

### Reducers

Nested Layout components support [reducers](references/tramvai/state/create-reducer.md) in `reducers` static property, these reducers will be registered in application store:

```tsx
Layout.reducers = [SomeDataStore];
```

This reducers will be code-splitted with layout component code.

### Adding a nested layout

#### `_layout.tsx`

With File-System Routing, adding a nested layout is trivial:

:hourglass: Create file `_layout.tsx` with layout component near page component:

```tsx title="routes/_layout.tsx"
import type { NestedLayoutComponent } from '@tramvai/react';

export const Layout: NestedLayoutComponent = ({ children }) => {
  return (
    <>
      <h3>Nested Layout</h3>
      <div>{children}</div>
    </>
  );
};

export default Layout;
```

And we will get this file structure:

```
src
└── routes
    ├── index.tsx
    └── _layout.tsx
```

After this, layout will be rendered at application main page.

#### For manually created routes

With File-System Components, you can add a nested layout in two steps:

:hourglass: Create file with layout component in `pages` directory:

```tsx title="pages/custom-nested-layout.tsx"
import type { NestedLayoutComponent } from '@tramvai/react';

export const Layout: NestedLayoutComponent = ({ children }) => {
  return (
    <>
      <h3>Nested Layout</h3>
      <div>{children}</div>
    </>
  );
};

export default Layout;
```

And we will get this file structure:

```
src
└── pages
    ├── index.tsx
    └── custom-nested-layout.tsx
```

This component will be available with key `@/pages/custom-nested-layout`.

:hourglass: Add `nestedLayoutComponent` to route configuration:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'main',
      path: '/',
      config: {
        pageComponent: '@/pages/index',
        // highlight-next-line
        nestedLayoutComponent: '@/pages/custom-nested-layout',
      },
    }]),
  ],
});
```

After this, layout will be rendered at application main page.

##### - [Next: Error Boundaries](03-features/05-error-boundaries.md)
