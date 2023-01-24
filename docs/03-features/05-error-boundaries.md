---
id: error-boundaries
title: Error Boundaries
---

In SSR applications errors can occur in different stages:

- On server initialization
- At runtime, when server handle user request
- On browser page loading
- At runtime, during hydration, or when user interacts with page and make SPA-navigations

Server initialization errors block application deployment, easy to find and almost never reach the user. Moreover, `tramvai` provides a module [@tramvai/module-error-interceptor](references/modules/error-interceptor.md), that adds global error handlers to the application on the server-side.

Errors during page loading are often caused by network problems. Client application may be more resistant to bad connections with different techniques - e.g. Service Worker, retry resources requests - but such techniques will be specific to each application.

Runtime errors, both on server in browser, can be critical and require send error page in reply to the user with some `5xx` status.

This guide will be focused how to customize and show error pages for the users in different scenarios.

## Root Error Boundary (aka `5xx` page)

If a critical error occurred during the request handling, e.g. Page Error Boundary rendering was unsuccessful, or an exception has been thrown out in any [CommandLineRunner](concepts/command-line-runner.md) stages before rendering, `tramvai` provides an opportunity to render custom `5xx` page. Root Boundary works only on server side.

You can provide this boundary by using token `ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN`:

```ts
import { ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN } from '@tramvai/react';

const provider = {
  provide: ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN,
  useValue: RootErrorBoundary,
};
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

## Page Error Boundary

If the first rendering of the page on the server fails, `tramvai` will try to render the page a second time, but already using the Error Boundary with fallback component. Also, we use [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html) under the hood, so the error fallback will render in case of any rendering errors in the browser.

You can provide default fallback for all pages, and specific fallback to concrete page. In this fallback components `tramvai` will pass `url` and `error` properties:

```tsx title="DefaultErrorBoundary.tsx"
export const DefaultErrorBoundary = ({ url, error }) => {
  return (
    <div>
      <h1>Something wrong!</h1>
      <p>Location: {url.path}</p>
      <p>Error: {error.message}</p>
    </div>
  );
};
```

:::info

Default response status for server-side Error Boundary - `500`. This status can be changed by adding `httpStatus` property to `Error` object.

:::

### Default fallback

<!-- @TODO: default fallback for file-system routing! -->

You can provide default error fallback component for all pages by using token `DEFAULT_ERROR_BOUNDARY_COMPONENT`:

```ts
import { DEFAULT_ERROR_BOUNDARY_COMPONENT } from '@tramvai/tokens-render';

const provider = {
  provide: DEFAULT_ERROR_BOUNDARY_COMPONENT,
  useValue: DefaultErrorBoundary,
};
```

### Specific fallback

There are two ways to add a specific error boundary to the page.

#### \_error.tsx

You can declare an error boundary to the page by adding a file called `_error.tsx` near the page component:

```
src
└── pages
    ├── login
      └── index.tsx
      └── _error.tsx
```

The component signature still be the same as the [DefaultErrorBoundary](#page-error-boundary), so properties `error` and `url` will be available here.

#### For manually created route

Concrete fallback for any of application pages can be registered in route configuration:

:hourglass: Create fallback component in `pages` directory:

```tsx title="pages/comments-fallback.tsx"
export const CommentsFallback = ({ error }) => {
  return (
    <div>
      <h1>Unexpected Error</h1>
      <p>Can't show comments, reason: {error.message}</p>
    </div>
  );
};
```

And we will get this file structure:

```
src
└── pages
    ├── comments.tsx
    └── comments-fallback.tsx
```

:hourglass: Add `errorBoundaryComponent` to route configuration:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'comments',
        path: '/comments/',
        config: {
          pageComponent: '@/pages/comments',
          // highlight-next-line
          errorBoundaryComponent: '@/pages/comments-fallback',
        },
      },
    ]),
  ],
});
```

## How to

### How to render page error fallback on errors in actions?

By default, errors in [actions](concepts/action.md) are skipped on server-side, and `tramvai` try to execute failed actions again in browser. The exception is `NotFoundError` and `RedirectFoundError` from `@tinkoff/errors` library - these errors will cause `404` page rendering or redirect accordingly.

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

Errors in [router guards](references/libs/router.md#router-guards) will be ignored by default. Like the previous reciepe, if you need to render page fallback from guard, you can dispatch `setPageErrorEvent` inside:

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
};
```

##### - [Next: App Lifecycle](03-features/06-app-lifecycle.md)
