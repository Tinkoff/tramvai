---
id: routing
title: Working with Url
---

## Explanation

Routing is configured and controlled by the Root App, Child App has a limited set of capabilities to work with `tramvai` router.

Child App has access to `tramvai` router through DI and can make navigations or subscribe to route changes in React components, but it can't add additional routes in the application.

## Usage

### Installation

First, you need to install `@tramvai/module-router` module and `@tramvai/tokens-router` in your Child App:

```bash
npx tramvai add @tramvai/module-router
npx tramvai add @tramvai/tokens-router
```

Then, connect `RouterChildAppModule` from this module in your `createChildApp` function:

```ts
import { createChildApp } from '@tramvai/child-app-core';
import { RouterChildAppModule } from '@tramvai/module-router';
import { RootCmp } from './components/root';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'fancy-child',
  render: RootCmp,
  modules: [RouterChildAppModule],
  providers: [],
});
```

### Make navigations

Simplest way to make navigations in Child App is to use [`<Link />` component](03-features/07-routing/04-links-and-navigation.md#link-component).

Another way is to use [PAGE_SERVICE_TOKEN](03-features/07-routing/04-links-and-navigation.md#pageservice-service) token from Root App, for example you can use it in React components directly with `useDi`, let's make navigation to `/another-page/`:

```tsx title="components/root.tsx"
import { useDi } from '@tramvai/react';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const RootCmp = () => {
  const pageService = useDi(PAGE_SERVICE_TOKEN);
  const navigate = () => pageService.navigate('/another-page/');

  return (
    <button onClick={navigate}>Navigate to /another-page/</button>
  );
};
```

### Update current route

`PAGE_SERVICE_TOKEN` is also used to update current route without navigation. We already use it directly in React component, let's try Actions now, for example we will add a `myOwnQuery` query parameter:

```tsx title="components/root.tsx"
import { declareAction } from '@tramvai/core';
import { useActions } from '@tramvai/state';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

const updateQueryAction = declareAction({
  name: 'update-query',
  async fn(value: string) {
    // highlight-next-line
    return this.deps.pageService.updateCurrentRoute({ query: { myOwnQuery: value } });
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});

export const RootCmp = () => {
  // highlight-next-line
  const updateQuery = useActions(updateQueryAction);
  const handleUpdate = () => updateQuery('some value');

  return (
    <>
      <button onClick={handleUpdate}>add myOwnQuery query parameter</button>
    </>
  );
};
```

### Subscribe to route changes

[`useRoute` and `useUrl` hooks](03-features/07-routing/03-working-with-url.md) is available to use in Child App for subscriptions to route changes:

```tsx title="components/root.tsx"
import { useRoute } from '@tramvai/module-router';

export const RootCmp = () => {
  const route = useRoute();

  return <div>Route path: {route.actualPath}</div>;
};
```
