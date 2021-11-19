# @tinkoff/router

Routing library. It can work both on the server and on the client. Designed primarily for building isomorphic applications.

## Installation

You need to install `@tinkoff/router`:

```bash
yarn add @tinkoff/router
```

And connect it to the project:

```tsx
import { Router } from '@tinkoff/router';

const router = new Router();
```

## Explanation

Features:

- The library supports options for working both on the server and on the client.
- It is possible to use different client transition options: with or without SPA transitions.
- There are Guards to check the availability of a route under specific conditions.
- You can subscribe to different stages of the transition through hooks
- Components and hooks for easy routing from react

### Server and client version

It is enough just to import routing from the library itself and, based on the settings in package.json, the required version for the server or client will be returned

```ts
import { Router } from '@tinkoff/router';
```

### Client routing with/without SPA transitions

By default, routing with SPA transitions is enabled on the client. If you need to disable SPA transitions, you need to import a special version of the routing

```ts
import { Router, SpaHistory } from '@tinkoff/router';
import { NoSpaRouter } from '@tinkoff/router';

const spaRouter = new Router({ history: new SpaHistory() });
const noSpaRouter = new NoSpaRouter();
```

### Router Guards

Guards allow you to control the availability of a particular route for a specific transition. From the guard, you can block the transition or initiate a redirect.

```ts
import { NavigationGuard } from '@tinkoff/router';

export const myGuard: NavigationGuard = async ({ to }) => {
  if (to.config.blocked) {
    return false; // block this transition
  }

  if (to.config.redirect) {
    return '/login/'; // call a redirect to the specified page
  }

  // if nothing is returned, the transition will be performed as usual
};
```

### Transitions hooks

Transition hooks allow you to perform your asynchronous actions at different stages of the transition.

```ts
import { NavigationHook } from '@tinkoff/router';

export const myHook: NavigationHook = async ({ from, to, url, fromUrl }) => {
  console.log(`navigating from ${from} to route ${to}`);
};
```

## API

### Getting data about the current route or url

```ts
router.getCurrentRoute(); // will return the current route
router.getCurrentUrl(); // will return the parsed version of the url of the current page
```

### Transition initiation

There are two methods for initializing the navigation and updating the address bar in the browser. The main difference between these two methods is that one of them will launch a full-fledged transition with data updating and starting heavy data loading actions. The second method is mainly used to update the state for the current route: to update the query parameters on the page or change the dynamic parameters of the route itself.

#### navigate

Initiates a full transition, defining the next route and updating the state in the browser.

```ts
router.navigate('/test');
router.navigate({ url: './test', query: { a: '1' } });
```

Transition hooks:

- beforeResolve
- beforeNavigate
- afterNavigate

#### updateCurrentRoute

The transition is based on the current route (therefore this method cannot be called on the server) and allows you to simply update some data for the current page

```ts
router.updateCurrentRoute({ params: { id: 'abc' } });
router.updateCurrentRoute({ query: { a: '1' } });
```

Hooks:

- beforeUpdateCurrent
- afterUpdateCurrent

### Working with query

#### query option

Allows you to set a search string for an url as an object via the `query` option when navigating. The previous query value will be cleared

```ts
router.getCurrentUrl().query; // { с: 'c' }

router.navigate({ query: { a: 'a', b: 'b' } });
router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

router.getCurrentUrl().query; // { a: 'a', b: 'b' }
```

#### preserveQuery

Allows you to keep the query value from the current navigation and use them in a new transition

```ts
router.getCurrentUrl().query; // { с: 'c' }

router.navigate({ query: { a: 'a' }, preserveQuery: true });
router.updateCurrentRoute({ query: { a: 'a' }, preserveQuery: true });

router.getCurrentUrl().query; // { a: 'a', c: 'c' }
```

If you pass undefined as the value for a specific query key, then this value will be cleared in a new query:

```ts
router.getCurrentUrl().query; // { a: 'a', b: 'b' }

router.navigate({ query: { a: undefined, c: 'c' }, preserveQuery: true });
router.updateCurrentRoute({ query: { a: undefined, c: 'c' }, preserveQuery: true });

router.getCurrentUrl().query; // { b: 'b', c: 'c' }
```

### Integration with React

Library has some useful React hooks and components for working with routing

#### useRoute

Returns current active route of the application

```ts
import React from 'react';
import { useRoute } from '@tinkoff/router';

export const Component = () => {
  const route = useRoute();

  return <div>Route path: {route.actualPath}</div>;
};
```

#### useUrl

Returns current active URL of the application

```ts
import React from 'react';
import { useUrl } from '@tinkoff/router';

export const Component = () => {
  const url = useUrl();

  return <div>Url query: {JSON.stringify(url.query)}</div>;
};
```

#### useNavigate

Creates a callback with a navigation call that can be passed to child components or used as an event handler

```ts
export const Cmp = () => {
  const navigate = useNavigate('/test/');

  return <div onClick={navigate}>Test</div>;
};
```

#### Link

A wrapper for a react component that makes it clickable

> If the react component is passed to the Link as children, then this passed component will be rendered and the `href`, `onClick` props will be passed as props to that component and they should be used to make the navigation. Otherwise, the `<a>` tag will be rendered with children as a child.

```ts
import { Link } from '@tinkoff/router';
import CustomLink from '@custom-scope/link';

export const Component = () => {
  return (
    <Link url="/test/">
      <CustomLink />
    </Link>
  );
};

export const WrapLink = () => {
  return <Link url="/test/">Click me</Link>;
};
```
