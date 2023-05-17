---
id: wildcard-routes
title: Wildcard Routes
---

Wildcard routes (aka catch-all, splats routes) - this is a routes with dynamic segment which used if no exact matches were found for the current page.

## Usage

The `path` property of this route must end in an asterisk - `*`, in example below the route will match any path, for which no other routes were found:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'route-name',
        path: '*',
        config: {
          pageComponent: '@/pages/page-name',
        },
      },
    ]),
  ],
});
```

### Not Found Page

Common use-case for wildcard routes - display `Not Found` (or `404`) page.

By default, if user will open non-existed application page, `tramvai` will send `NotFoundError` with `404` HTTP status code and empty body to the client. But if appropriate wildcard route is configured, `tramvai` will render this route with `200` HTTP status code.

So, if you want to create custom `404` page, you should configure wildcard route with `httpStatus` option:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'not-found',
        path: '*',
        config: {
          pageComponent: '@/pages/not-found',
          // highlight-next-line
          httpStatus: 404,
        },
      },
    ]),
  ],
});
```

#### How to render 404 page programmatically

Wildcard routes have one important limitation - for now it is not possible to render this `404` page programmatically, for example, in Action or Router Guard. If you need to render custom `404` page in this cases, you can use [Error Boundaries](03-features/05-error-boundaries.md).

For example, you have some product page - `routes/products/[id]/index.tsx`, and API endpoint for this page returns `404` status code, if product with given id not found. In this case, you can create custom `404` page and render it in page error boundary - `routes/products/[id]/_error.tsx`:

:hourglass: Create error boundary component, where 404 and any unexpected error will be handled:

```tsx title="routes/products/[id]/_error.tsx"
import { isNotFoundError } from '@tinkoff/errors';
import type { ErrorBoundaryComponent } from '@tramvai/react';

const ProductErrorBoundary: ErrorBoundaryComponent = ({ url, error }) => {
  // handle custom NotFoundError
  if (isNotFoundError(error)) {
    return <ProductNotFoundPage url={url} error={error} />;
  }
  // handle unexpected errors
  return <ProductErrorPage url={url} error={error} />;
};

export default ProductErrorBoundary;
```

:hourglass: Force error boundary render in page Action:

:::warning

`setPageErrorEvent` - experimental API, and can be changed in future releases.

:::

```tsx title="routes/products/[id]/index.tsx"
import { NotFoundError } from '@tinkoff/errors';
import { declareAction } from '@tramvai/core';
import type { PageComponent } from '@tramvai/react';
import { PAGE_SERVICE_TOKEN, setPageErrorEvent } from '@tramvai/module-router';

const fetchProductAction = declareAction({
  name: 'fetchProductAction',
  async fn() {
    const { id } = this.deps.pageService.getCurrentRoute().params;

    try {
      await fetchProduct(id);
    } catch (e) {
      // this error provide 404 status by default
      const error = new NotFoundError();
      this.dispatch(setPageErrorEvent(error));
    }
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});

const ProductPage: PageComponent = () => <h1>Product Page</h1>;

ProductPage.actions = [fetchProductAction];

export default ProductPage;
```

### Nested Wildcard Routes

You can have multiple wildcard routes for different subpaths:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'comments-not-found',
        path: '/comments/*',
        config: {
          pageComponent: '@/pages/comments-not-found',
        },
      },
    ]),
  ],
});
```

### File system Wildcard Routes

You can register a wildcard route using the file system. To do so you must create a file called `[...path].tsx` in the desirable directory. Note, that nested paths are also supported. For example if you need wildcard for path `/profile/*`, then create following folder structure:

:::tip

There is can be any name in the pattern, not only `...path`

:::

```
src
└── routes
    └── profile
        └── index.tsx
        └── [...path].tsx
```
