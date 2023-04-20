---
id: working-with-url
title: Working with Url
---

## Route

Route description format:

```ts
const routes = [
  {
    // the name of the route is required
    name: 'foo-bar',
    // the path of the route is required
    path: '/foo/bar/',
    // additional configs for the route
    config: {
      // page component name
      pageComponent: 'page',
      // page layout component name
      nestedLayoutComponent: 'page-layout',
      // global layout component name
      layoutComponent: 'layout',
    },
  },
];
```

Route interface (this is a config that is defined for route somewhere when application starts):

```ts
interface Route {
  // name of the route
  name: string;
  // path in route config. Might not be equal to the actual path in browser as
  // it may have a dynamic parts
  path: string;
  // additional config for route, that is not used by router library, but
  // might be used by router dependents
  config?: Record<string, any>;
  // redirect options that should happed when navigating to current route
  redirect?: string | NavigateOptions;
}
```

NavigationRoute interface (this is an instance that created on every navigation from base route by adding additional parameters related to specific navigation):

```ts
interface NavigationRoute extends Route {
  // actual path that was resolved from requested url. Unlike `path` actualPath
  // won't contain any dynamic parts and will be equal to path in browser
  actualPath: string;
  // resolved parts of the dynamic routes, where key is the name of dynamic part
  // and value is the actual value from the current url
  params: Record<string, string>;
  // additional state that can be passed by caller side on navigation
  navigateState?: any;
}
```

## Url

Url interface:

```ts
interface Url {
  path: string;
  query: Record<string, string | string[]>;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  hash: string;
}
```

## `useRoute()` Hook

Returns current active route of the application:

```tsx
import { useRoute } from '@tramvai/module-router';

export const Component = () => {
  const route = useRoute();

  return <div>Route path: {route.actualPath}</div>;
};
```

## `useUrl()` Hook

Returns current active URL of the application:

```tsx
import { useUrl } from '@tramvai/module-router';

export const Component = () => {
  const url = useUrl();

  return <div>Url query: {JSON.stringify(url.query)}</div>;
};
```

## `PageService` Service

`PageService` is a wrapper for working with `tramvai` router. Serves to hide routing internals and is the preferred way to working with router. Available via `PAGE_SERVICE_TOKEN` token.

This service is intended for use in DI providers and actions, also it is a performant option to get route information in React components, e.g. in callback functions, when you don't need to rerender component when route is changed.

- `getCurrentRoute()` - get the current route
- `getCurrentUrl()` - object-result of parsing the current url
- `getConfig()` - get the config of the current page (`route.config` property)
- `getContent()` - get content for the current page (`route.config.content` property)
- `getMeta()` - get the meta for the current page (`route.config.meta` property)

```ts
import { provide, declareAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

const action = declareAction({
  name: 'action',
  fn() {
    const { pageService } = this.deps;

    console.log(`Current path is`, pageService.getCurrentRoute().path);
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

## `RouterStore` Reducer

Stores information about the current and previous routes.

Properties:

- `currentRoute`
- `currentUrl`
- `previousRoute`
- `previousUrl`

## Route Params

Dynamic parameters available in current `route.params` parameter.

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
};
```

In actions, use `PAGE_SERVICE_TOKEN`:

```tsx
import { declareAction } from '@tramvai/core';

const someAction = declareAction({
  name: 'someAction',
  fn() {
    const route = this.deps.pageService.getCurrentRoute();

    console.log(`Current comment id: ${route.params.id}`);
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

## Query Params

### Read

Parsed query string available in `url.query` parameter.

In react components, use `useUrl` hook:

```tsx
import { useRoute } from '@tramvai/module-router';

const Page = () => {
  const url = useUrl();

  return (
    <li>
      Foo query value: {url.query.foo}
    </li>
  );
};
```

In actions, use `PAGE_SERVICE_TOKEN`:

```tsx
import { declareAction } from '@tramvai/core';

const someAction = declareAction({
  name: 'someAction',
  fn() {
    const url = this.deps.pageService.getCurrentUrl();

    console.log(`Foo query value: ${url.query.foo}`);
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

### Update

`navigate` and `updateCurrentRoute` methods allow you to set a search string for an url as an object via the `query` option when navigating. The previous query value will be cleared:

```ts
pageService.navigate({ query: { a: 'a' } });
pageService.updateCurrentRoute({ query: { b: 'b' } });
```

`preserveQuery` option allows you to keep the query value from the current navigation and use them in a new transition:

```ts
pageService.updateCurrentRoute({ query: { a: 'a' }, preserveQuery: true });
```

If you pass undefined as the value for a specific query key, then this value will be cleared in a new query:

```ts
pageService.navigate({ query: { a: undefined, b: 'b' }, preserveQuery: true });
```
