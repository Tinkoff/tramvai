---
id: error-boundary
title: Error Boundaries
---

In SSR applications errors can occure in different stages:

- On server initialization
- At runtime, when server handle user request
- On browser page loading
- At runtime, during hydration, or when user interacts with page and make SPA-navigations

Server initialization errors block application deployment, easy to find and almost never reach the user.
Moreover, `tramvai` provides a module [@tramvai/module-error-interceptor](references/modules/error-interceptor.md), that adds global error handlers to the application on the server-side.

Errors during page loading are often caused by network problems.
Client application may be more resistant to bad connections with different techniques - e.g. Service Worker, retry resources requests - but such techniques will be specific to each application.

Runtime errors, both on server in browser, can be critical and require send error page in reply to the user with some `5xx` status.

This guide will be focused how to customize and show error pages for the users in different scenarios.

## Page Error Boundary

If the first rendering of the page on the server fails, `tramvai` will try to render the page a second time, but already using the Error Boundary with fallback component.
Also, we use [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html) under the hood, so the error fallback will render in case of any rendering errors in the browser.

You can provide default fallback for all pages, and specific fallback to concrete page.
In this fallback components `tramvai` will pass `url` and `error` properties:

```tsx title="components/ErrorBoundaryFallback"
export const ErrorBoundaryFallback = ({ url, error }) => {
  return (
    <div>
      <h1>Something wrong!</h1>
      <p>Location: {url.path}</p>
      <p>Error: {error.message}</p>
    </div>
  )
}
```

:::tip

Default response status for server-side Error Boundary - `500`.
This status can be changed by adding `httpStatus` property to `Error` object.

:::

### Default fallback

<!-- @TODO: default fallback for file-system routing! -->

Default fallback component can be registered in any application [bundle](concepts/bundle.md), like a component with name `errorBoundaryDefault`, e.g.:

```ts title="bundles/mainDefault.ts"
export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: PageComponent,
    errorBoundaryDefault: ErrorBoundaryFallback,
  },
});
```

### Specific fallback

<!-- @TODO: specific fallback for file-system routing! -->

Concrete fallback for any of application pages can be registered by a few ways:

1. In page [bundle](concepts/bundle.md)

    ```ts title="bundles/mainDefault.ts"
    export default createBundle({
      name: 'mainDefault',
      components: {
        pageDefault: PageComponent,
        errorBoundaryDefault: ErrorBoundaryFallback,
        commentsPage: CommentsPage,
        // highlight-next-line
        commentsPageErrorBoundary: CommentsErrorBoundaryFallback,
      },
    });
    ```

1. In page component, using the `components` property

    ```tsx title="pages/comments.tsx"
    import React from 'react';

    export const CommentsPage = () => null;

    CommentsPage.components = {
        // highlight-next-line
        commentsPageErrorBoundary: CommentsErrorBoundaryFallback,
    };
    ```

After fallback registration, you need to add the name with which the component was registered to page route configuration:

```ts title="routes.ts"
export const routes = [
  {
    name: 'main',
    path: '/',
    config: {},
  },
  {
    name: 'comments',
    path: '/comments/',
    config: {
      pageComponent: 'commentsPage',
      // highlight-next-line
      errorBoundaryComponent: 'commentsPageErrorBoundary',
    },
  },
];
```

## Root Error Boundary

If a critical error occurred during the request handling, e.g. Page Error Boundary rendering was unsuccessful, or an exception has been thrown out in any [CommandLineRunner](concepts/command-line-runner.md) stages before rendering, `tramvai` provides an opportunity to render custom `5xx` page. Root Boundary works only on server side.

You can provide this boundary by using token `ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN`:

```ts
import { ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN } from '@tramvai/react';

const provider = {
  provide: ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN,
  useValue: RootErrorBoundary,
}
```

This components will have access to `error` and `url` in properties, and need to render complete HTML page, e.g.:

```tsx title="components/RootErrorBoundary.tsx"
import React from 'react';

export const RootErrorBoundary = ({ error, url }) => {
  return (
    <html lang="ru">
      <head>
        <title>
          Error {error.message} at {url.path}
        </title>
      </head>
      <body>
        <h1>Root Error Boundary</h1>
      </body>
    </html>
  );
};
```

:::caution

If this component also crashes at the rendering stage, in case of `HttpError` user will get an empty `response.body`, otherwise [finalhandler library](https://github.com/pillarjs/finalhandler) will send default HTML page with some information about error.

:::

## How to

### How to render page error fallback on errors in actions?

By default, errors in [actions](concepts/action.md) are skipped on server-side, and `tramvai` try to execute failed actions again in browser.
The exception is `NotFoundError` and `RedirectError` from `@tinkoff/errors` library - these errors will cause `404` page rendering or redirect accordingly.

If the action failed to fetch critical data for page rendering, and you want to change response status code, and show error page for user, you need to dispath `setPageErrorEvent` action:

```ts
import { declareAction } from '@tramvai/core';
import { HttpError } from '@tinkoff/errors';
import { setPageErrorEvent } from '@tramvai/module-render';

const action = declareAction({
  name: 'action',
  fn() {
    // set custom response status, `500` by default
    const error = new HttpError({ httpStatus: 410 });
    this.dispatch(setPageErrorEvent(error));
  },
});
```

### How to render page error fallback on errors in router guards?

Errors in [router guards](references/libs/router.md#router-guards) will be ignored by default.
Like the previous reciepe, if you need to render page fallback from guard, you can dispatch `setPageErrorEvent` inside:

```ts
import { STORE_TOKEN } from '@tramvai/module-common';
import { ROUTER_GUARD_TOKEN } from '@tramvai/module-router';
import { setPageErrorEvent } from '@tramvai/module-render';
import { HttpError } from '@tinkoff/errors';

const provider = {
  provide: ROUTER_GUARD_TOKEN,
  multi: true,
  useFactory: ({ store }) => {
    return async ({ to }) => {
      // guards runs for every pages, and we need to check next path if want to show error only on specific routes
      if (to?.path === '/some-restricted-page/') {
        const error = new HttpError({ httpStatus: 503 });
        store.dispatch(setPageErrorEvent(error));
      }
    };
  },
  deps: {
    store: STORE_TOKEN,
  },
}
```
