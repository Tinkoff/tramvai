---
id: links-and-navigation
title: Links and Navigation
---

## `<Link>` Component

`Link` - main component for `tramvai` router navigations inside React components.

By default, Link will render `<a>` as a children. You can change this by passing a React component as a children - passed component should accept props `href`, `onClick` that should be used in order to make the navigation.

Example:

```tsx
import { Link } from '@tramvai/module-router';
import CustomLink from '@any-ui-kit/link';

export const WrappedCustomLink = () => {
  return (
    <Link url="/test/">
      <CustomLink />
    </Link>
  );
};

export const DefaultLink = () => {
  return <Link url="/test/">Click me</Link>;
};
```

### Page resources prefetch

`Link` component will try to prefetch resources for passed `url`, if this `url` is handled by the application router.

It will help to make subsequent page-loads faster because target page assets already be saved in browser cache.

:::info

Your passed component need to be wrapped in the `forwardRef` for routes assets prefetching

:::

How it works:

- Component determines when it is in the viewport (using `Intersection Observer`)
- waits until the browser is idle (using `requestIdleCallback`)
- checks if the user isn't on a slow connection (using `navigator.connection.effectiveType`) or has data-saver enabled (using `navigator.connection.saveData`)
- triggers page resources (js, css) prefetching

Main reference for this feature - [quicklink](https://github.com/GoogleChromeLabs/quicklink) library.

If you want to disable this behaviour, pass `prefetch={false}` property.

```tsx
export const WrapLink = () => {
  return <Link url="/test/" prefetch={false}>Click me</Link>;
};
```

## `useNavigate()` Hook

`useNavigate` hook - another way to make navigation from React component.

By default, `useNavigate` returns a function, which can be called with any url (string or `NavigateOptions` object):

```tsx
import { useNavigate } from '@tramvai/module-router';

export const Page = () => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate('/test/')}>
      Navigate to /test/
    </button>
  );
};
```

Also, you can create a navigation callback with predefined parameters:

```tsx
import { useNavigate } from '@tramvai/module-router';

export const Page = () => {
  const navigateToTest = useNavigate({ url: '/test/', query: { a: '1', b: '2' } });

  return (
    <button type="button" onClick={navigateToTest}>
      Navigate to /test/
    </button>
  );
};
```

## `PageService` Service

`PageService` - is a wrapper for working with `tramvai` router. Serves to hide routing internals and is the preferred way of working with router. Available via `PAGE_SERVICE_TOKEN` token.

This service is intended for use in DI providers and actions.

### Navigation

`navigate(url)` method make a navigation to a new page and accept target url as argument (string or `NavigateOptions` object):

```ts
import { provide, commandLineListTokens } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

const provider = provide({
  provide: commandLineListTokens.resolvePageDeps,
  useFactory: ({ pageService }) => {
    return function redirect() {
      if (pageService.getCurrentUrl().pathname === '/test/') {
        return pageService.navigate({ url: '/redirect/', replace: true });
      }
    };
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

### Route Update

`updateCurrentRoute(options)` method updates the current route without page reload with new parameters (`BaseNavigateOptions` object), for example you can change query parameters:

```ts
import { provide, declareAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

const action = declareAction({
  name: 'action',
  fn() {
    const { pageService } = this.deps;

    if (pageService.getCurrentUrl().pathname === '/test/') {
      return pageService.updateCurrentRoute({ query: { a: '1', b: '2' } });
    }
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

### History Back

`back()` method will go back through history

### History Forward

`forward()` method will go forward through history

### History Go

`go(to)` method will go to the specified delta by history

### `NavigateOptions`

Object that allows to specify transition options both to [navigate](#navigation) and [updateCurrentRoute](#route-update) transitions:

- `code` - redirect code that is returned on server in case of redirects
- `navigateState` - any additional data that is stored with route

##### - [Next: Routing - Hooks and Guards](03-features/07-routing/05-hooks-and-guards.md)
