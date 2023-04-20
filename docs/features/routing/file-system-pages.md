---
id: file-system-pages
title: File-System Pages
sidebar_position: 2
---

[Actual documentation](03-features/03-pages.md#file-system-routing)

## Migration

If you want to migrate from bundles to file-system pages, there is few steps:

1. Enable `fileSystemPages.enable` option in `tramvai.json`, and change default folders for safety:

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
    import { lazy, PageComponent } from '@tramvai/react';
    import { actionFoo, actionBar } from '../actions';
    import { StoreFoo, StoreBar } from '../reducers';
    import { CommonComponent } from '../components';

    // the same for src/new-fs-pages/bar.tsx
    const FooPage: PageComponent = () => {
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
