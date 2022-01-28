---
id: file-system-pages
title: File-System Pages
---

> Experimental feature!

`File-System Pages` sets file naming conventions and allows you to easily connect page components with application routes, or even generate [static routes](references/modules/router.md#static-routes-in-the-application) in your application.

## Explanation

### Motivation

By default, you need to provide page components with [bundles](concepts/bundle.md), then register this components for the corresponding routes, for example:

1. Create bundle with component (used [lazy](features/react.md#lazy) for granular code splitting):

    ```ts
    const commentsBundle = createBundle({
        name: 'comments',
        components: {
            'comments-list': lazy(() => import('./pages/CommentsList')),
        },
    });
    ```

1. Create static route with this bundle and component:

    ```ts
    const routes = [
        {
            name: 'comments',
            path: '/comments/',
            config: {
                bundle: 'comments',
                pageComponent: 'comments-list',
            },
        },
    ];
    ```

File-System Pages is designed to remove the first step, or even both steps, and make it easier to add new pages to the application.

### File-System Pages

The first option is to automatically read page components from the file system and register them inside an application, without need to specify bundle.
You can use this components by unique name in `route.config.pageComponent` property, and the component to be rendered for that route will be automatically wrapped in `lazy`.
Thus, all routes with file-system pages will load only neccesary JS and CSS chunks.

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

and you can create few static pages from them:

```ts
const routes = [
    {
        name: 'main',
        path: '/',
        config: {
            pageComponent: '@/pages/index',
        },
    },
    {
        name: 'comments',
        path: '/comments/',
        config: {
            pageComponent: '@/pages/comments',
        },
    },
];
```

[Example application](https://github.com/Tinkoff/tramvai/-/tree/master/examples/fs-pages)

### File-System Routing

Second option is less flexible, but fully automates the creation of routes in the application.
Static routes will be generated from file-system pages, and paths for this routes will be created based on paths to components, strictly conforming to naming conventions.

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
└── pages
    ├── index.tsx
    ├── login
      └── index.tsx
    └── comments
      ├── index.tsx
      └── [id]
        └── index.tsx
```

Where path with square brackets relates to dynamic parts of url.

> File for `/login/` page must be named `login/index.tsx` instead of `login.tsx`, because we must have strictly one way to convert url back to page component name.

[Example application](https://github.com/Tinkoff/tramvai/-/tree/master/examples/fs-routing)

## Usage

Experimental feature File-System Pages hidden behind the flag `commands.build.configurations.experiments.fileSystemPages.enable` in `tramvai.json` configuration file:

```json
{
  "projects": {
    "your-app-name" : {
      "commands": {
        "build": {
          "configurations": {
            "experiments": {
              "fileSystemPages": {
                "enable": true,
                "pagesDir": "pages",
                "routesDir": "routes"
              }
            }
          }
        }
      }
    }
  }
}
```

- `"enable": true` - activates the feature

- `"pagesDir": "pages"` - default directory for [File-System Pages](#file-system-pages)

- `"routesDir": "routes"` - default directory for [File-System Routing](#file-system-routing)

### Pages

You need to use default export in page components, e.g.:

```tsx
const CommentsPage = () => <h1>Comments</h1>;

export default CommentsPage;
```

### Actions

Page components support [global actions](concepts/action.md#global-actions) in `actions` static property, these actions will work as bundles actions:

```tsx
const CommentsPage = () => <h1>Comments</h1>;

CommentsPage.actions = [fetchCommentsListAction];

export default CommentsPage;
```

This actions will be code-splitted with page component code.

### Reducers

Page components support [reducers](features/state/create-reducer.md) in `reducers` static property, these reducers will be registered in application store:

```tsx
const CommentsPage = () => <h1>Comments</h1>;

CommentsPage.reducers = [CommentsStore];

export default CommentsPage;
```

This reducers will be code-splitted with page component code.

### Components

Page components support additional React components in `components` static property, this components will be registered in the application:

```tsx
const CommentsPage = () => <h1>Comments</h1>;

CommentsPage.components = {
  'modal-box': () => <dialog>Modal Box</dialog>,
};

export default CommentsPage;
```

This components will be code-splitted with page component code.

You can directly access these components with `PAGE_SERVICE`:

```tsx
import { useDi } from '@tramvai/react';
import { PAGE_SERVICE } from '@tramvai/tokens-router';

const CommentsPage = () => {
  const pageService = useDi(PAGE_SERVICE);
  const ModalBox = pageService.getComponent('modal-box');
 
  return (
    <>
      <h1>Comments</h1>
      <ModalBox />
    </>
  )
}
```

## How to

### How to change layout component

When use [File-System Pages](#file-system-pages), at first, add layout component to page `components`:

```tsx
const CommentsPage = () => <h1>Comments</h1>;

CommentsPage.components = {
  'comments-layout': CommentsLayout,
};

export default CommentsPage;
```

then, add this layout to `layoutComponent` property of appropriate route:

```ts
const routes = [
    {
        name: 'comments',
        path: '/comments/',
        config: {
            pageComponent: '@/pages/comments',
            layoutComponent: 'comments-layout',
        },
    },
];
```

When use [File-System Routing](#file-system-routing), at this moment you can't change the page layout.

### How to create static route with dynamic parameters

> [File-System Routing](#file-system-routing) example

Wrap dynamic part of url in square brackets in file path.

For `/comments/:id/` create page component with this path `pages/comments/[id]/index.tsx`:

```
src
└── pages
    └── comments
      └── [id]
        └── index.tsx
```

Dynamic parameter available in current route params.

In react components, use `useRoute` hook:

```tsx
import { useRoute } from '@tramvai/module-router';

const Comment = () => {
  const route = useRoute();

  return (
    <li>
      Current comment id: {route.params.id}
    </li>
  );
}
```

In actions, use `PAGE_SERVICE_TOKEN`:

```tsx
import { createAction } from '@tramvai/core';

const someAction = createAction({
  name: 'someAction',
  fn: (_, __, { pageService }) => {
    const route = pageService.getCurrentRoute();
    
    console.log(`Current comment id: ${route.params.id}`);
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

## Migration

If you want to migrate from bundles to file-system pages, there is few steps:

1. Enable `experiments.fileSystemPages.enable` option in `tramvai.json`, and change default folders for safety:

    ```json
    {
      "fileSystemPages": {
        "enable": true,
        "pagesDir": "new-fs-pages", // file-system pages directory
        "routesDir": false // force disable file-system routing
      }
    }
    ```

2. Split your bundles to components

    from this bundle `src/bundles/someBundle.ts`:

    ```tsx
    import { createBundle } from '@tramvai/core';
    import { lazy } from '@tramvai/react';
    import { actionFoo, actionBar } from '../actions';
    import { StoreFoo, StoreBar } from '../reducers';
    import { CommonComponent } from '../components';

    const someBundle = createBundle({
      name: 'someBundle',
      components: {
        'pages/foo-page': lazy(() => import('../pages/Foo')),
        'pages/bar-page': lazy(() => import('../pages/Bar')), 
        'components/common': CommonComponent,
      },
      actions: [actionFoo, actionBar],
      reducers: [StoreFoo, StoreBar],
    });

    export default someBundle;
    ```

    you need to create two page components, `src/new-fs-pages/foo.tsx` and `src/new-fs-pages/bar.tsx`, with this content:

    ```tsx
    import { lazy } from '@tramvai/react';
    import { actionFoo, actionBar } from '../actions';
    import { StoreFoo, StoreBar } from '../reducers';
    import { CommonComponent } from '../components';

    // the same for src/new-fs-pages/bar.tsx
    const FooPage = () => {
      return <h1>Foo Page</h1>;
    }

    FooPage.components = {
        'components/common': CommonComponent,
    };
    FooPage.actions = [actionFoo, actionBar];
    FooPage.reducers = [StoreFoo, StoreBar];

    export default FooPage;
    ```

    then update your routes config from:

    ```tsx
    const routes = [
        {
            name: 'foo',
            path: '/foo/',
            config: {
                bundle: 'sameBundle',
                pageComponent: 'pages/foo-page',
            },
        },
        {
            name: 'bar',
            path: '/bar/',
            config: {
                bundle: 'sameBundle',
                pageComponent: 'pages/bar-page',
            },
        },
    ]
    ```

    to this:

    ```tsx
    const routes = [
        {
            name: 'foo',
            path: '/foo/',
            config: {
                pageComponent: '@/new-fs-pages/foo',
            },
        },
        {
            name: 'bar',
            path: '/bar/',
            config: {
                pageComponent: '@/new-fs-pages/bar',
            },
        },
    ]
    ```

    and remove `bundle` property from `createApp`
