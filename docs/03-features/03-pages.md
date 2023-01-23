---
id: pages
title: Pages
---

## Page Component

In `tramvai` application Page is a React component, created in `routes` directory and exported by **default**. Every Page represents a new URL in the application.

Example:

```tsx title="routes/index.tsx"
import type { PageComponent } from '@tramvai/react';

const MainPage: PageComponent = () => <h1>Main Page</h1>;

export default MainPage;
```

`PageComponent` interface is used here for better typings - Page components may have additional static properties:

### Actions

Page components support [global actions](concepts/action.md#global-actions) in `actions` static property, these actions will executed only for this page:

```tsx
MainPage.actions = [fetchSomeDataAction];
```

This actions will be code-splitted with page component code.

### Reducers

Page components support [reducers](references/tramvai/state/create-reducer.md) in `reducers` static property, these reducers will be registered in application store:

```tsx
MainPage.reducers = [SomeDataStore];
```

This reducers will be code-splitted with page component code.

### Components

Page components support additional React components in `components` static property, this components will be registered in the application. You can directly access these components with `PAGE_SERVICE`:

```tsx
import { usePageService } from '@tramvai/module-router';
import type { PageComponent } from '@tramvai/react';

const MainPage: PageComponent = () => {
  const pageService = usePageService();
  const ModalBox = pageService.getComponent('modal-box');

  return (
    <>
      <h1>Main Page</h1>
      <ModalBox />
    </>
  )
};

MainPage.components = {
  'modal-box': () => <dialog>Modal Box</dialog>,
};
```

This components will be code-splitted with page component code.

### SEO and Meta Tags

All possibilites below provided by [SeoModule](references/modules/seo.md)

Easy way to change page meta is to add a `seo` property to page component:

```tsx
MainPage.seo = {
  metaTags: {
    title: 'Main Page Title',
  },
};
```

## File-System Routing

`tramvai` provides File-System Routing approach as default way to create new pages in the application, also you always have option to provide a list of routes directly in `tramvai` router. It is possible because in `tramvai` application every page represents plain `Route` object, and File-System routes is just high-level abstraction, easily converted in `Route` interface.

For example, you want to handle this urls by your application:

```
/
/login/
/comments/
/comments/:id/
```

In that case you need to create components with this file structure:

```
src
└── routes
    ├── index.tsx
    ├── login
      └── index.tsx
    └── comments
      ├── index.tsx
      └── [id]
        └── index.tsx
```

Where path with square brackets relates to dynamic parts of url.

:::info

Every page will be wrapped in dynamic import statement with `lazy` from [`@tramvai/react`](references/tramvai/react.md) library, and will be separated into a different chunk - it is important optimization for better code splitting.

:::

Under hood, `tramvai` will create this list of routes:

```ts
[{
  path: '/',
  config: {
    pageComponent: '@/routes/index',
  },
}, {
  path: '/login/',
  config: {
    pageComponent: '@/routes/login/index',
  },
}, {
  path: '/comments/',
  config: {
    pageComponent: '@/routes/comments/index',
  },
}, {
  path: '/comments/:id/',
  config: {
    pageComponent: '@/routes/comments/[id]/index',
  },
}];
```

:::info

File for `/login/` page must be named `login/index.tsx` instead of `login.tsx`, because we must have strictly one way to convert url back to page component name.

:::

[Example application](https://github.com/Tinkoff/tramvai/-/tree/master/examples/fs-routing)

## Define routes manually

All components inside `pages` directory will be automatically read from the file system and registered inside an application, this feature is called File-System Components. You can use this components by unique name when manually configuring the routes.

For example, you create page components with this file structure:

```
src
└── pages
    ├── index.tsx
    └── comments.tsx
```

This components will be available in the application with these names:

```
@/pages/index
@/pages/comments
```

:::info

Every component will be wrapped in dynamic import statement with `lazy` from [`@tramvai/react`](references/tramvai/react.md) library, and will be separated into a different chunk - it is important optimization for better code splitting.

:::

And you can create this routes with them:

```ts
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'main',
      path: '/',
      config: {
        pageComponent: '@/pages/index',
      },
    }, {
      name: 'comments',
      path: '/comments/',
      config: {
        pageComponent: '@/pages/comments',
      },
    }]),
  ],
});
```

[Example application](https://github.com/Tinkoff/tramvai/-/tree/master/examples/fs-pages)

Another way, for example if you want to define routes in different modules, is to use `ROUTES_TOKEN`:

```ts
import { Module } from '@tramvai/core';
import { SpaRouterModule } from '@tramvai/modules-router';

@Module({
  providers: [
    provide({
      provide: ROUTES_TOKEN,
      useValue: [{
        name: 'comments',
        path: '/comments/',
        config: {
          pageComponent: '@/pages/comments',
        },
      }]
    }),
  ],
})
export class CommentsModule {}
```

## Configuration

File-System Routing is configured by `fileSystemPages` option in `tramvai.json`:

```json title="tramvai.json"
{
  "projects": {
    "awesome-app": {
      "commands": {
        "build": {
          "configurations": {
            "fileSystemPages": {
              "enable": true,
              "routesDir": "routes",
              "pagesDir": "pages"
            }
          }
        }
      }
    }
  }
}
```

## How to

### How to create page with dynamic parameters

Wrap dynamic part of url in square brackets in file path.

For `/comments/:id/` create page component with this path `routes/comments/[id]/index.tsx`:

```
src
└── routes
    └── comments
      └── [id]
        └── index.tsx
```

When you define routes manually, use colon - `:` in path segment:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'single-comment',
      path: '/comments/:id/',
      config: {
        pageComponent: '@/pages/single-comment',
      },
    }]),
  ],
});
```

Dynamic parameter available in current route params, more information in [Working with Url documentation](03-features/07-routing/03-working-with-url.md#route-params).

##### - [Next: Layouts](03-features/04-layouts.md)
