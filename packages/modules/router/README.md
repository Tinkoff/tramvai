# @tramvai/module-router

Module for routing in the application.
Exports two sub-modules: with client SPA transitions, and no-SPA.

## Installation

You need to install `@tramvai/module-router`:

```bash
yarn add @tramvai/module-router
```

And connect in the project:

```tsx
import { createApp } from '@tramvai/core';
import { NoSpaRouterModule, SpaRouterModule } from '@tramvai/module-router';

createApp({
  name: 'tincoin',
  modules: [SpaRouterModule],
  // modules: [ NoSpaRouterModule ], if you want to disable client SPA transitions
});
```

## Explanation

The module is based on the library [@tinkoff/router](references/libs/router.md)

### Navigation flow on the server

![Diagramm](/img/router/navigate-flow-server.drawio.svg)

### Flow of the first navigation on the client

![Diagramm](/img/router/rehydrate-client.drawio.svg)

### Flow of navigation on the client without SPA transitions

![Diagramm](/img/router/navigate-flow-client-no-spa.drawio.svg)

### Flow of navigation on the client with SPA transitions

![Diagramm](/img/router/navigate-flow-client-spa.drawio.svg)

## API

### Static routes in the application

Route description format:

```ts
const routes = [
  {
    // the name of the route is required
    name: 'route1',
    // the path of the route is required
    path: '/route/a/',
    // additional configs for the route
    config: {
      // layout component name
      layoutComponent: 'layout',
      // page component name
      pageComponent: 'page',
    },
  },
];
```

You can explicitly transfer a list of routes to routing when adding a router module:

```ts
import { createApp } from '@tramvai/core';
import { SpaRouterModule } from '@tramvai/module-router';

const routes = [
  // ...
];

createApp({
  modules: [
    // ...,
    SpaRouterModule.forRoot(routes),
  ],
});
```

Or separately with the `ROUTES_TOKEN` token (you can set it several times):

```ts
import { ROUTES_TOKEN } from '@tramvai/module-router';
import { provide } from '@tramvai/core';

const routesCommon = [
  // ...
];
const routesSpecific = [
  // ...
];

const providers = [
  // ...,
  provide({
    provide: ROUTES_TOKEN,
    multi: true,
    useValue: routesCommon,
  }),
  provide({
    provide: ROUTES_TOKEN,
    multi: true,
    useValue: routesSpecific,
  }),
];
```

### PAGE_SERVICE_TOKEN

Service wrapper for working with routing. Serves to hide routing work and is the preferred way of routing work.

Methods:

- `getCurrentRoute()` - get the current route
- `getCurrentUrl()` - object-result of parsing the current url
- `getConfig()` - get the config of the current page
- `getContent()` - get content for the current page
- `getMeta()` - get the meta for the current page
- `navigate(options)` - navigation to a new page [more](references/libs/router.md)
- `updateCurrentRoute(options)` - update the current route with new parameters [more](references/libs/router.md)
- `back()` - go back through history
- `forward()` - go forward through history
- `go(to)` - go to the specified delta by history
- `addComponent(name, component)` - add new component to current page into ComponentRegistry
- `getComponent(name)` - get component from current page components from ComponentRegistry

### RouterStore

Store that stores information about the current and previous routes.

Properties:

- `currentRoute` - current route
- `currentUrl` - current url
- `previousRoute` - previous route
- `previousUrl` - previous url

### ROUTER_GUARD_TOKEN

Allows you to block or redirect the transition to the page under certain conditions. See [@tinkoff/router](/references/libs/router.md)

### Redirects

Redirects can be done via [guards](#ROUTER_GUARD_TOKEN) or explicitly via the `redirect` property in the route.

```ts
const routes = [
  // ...,
  {
    name: 'redirect',
    path: '/from/',
    redirect: '/to/',
  },
];
```

### Not Found route

The route used if no matches were found for the current page, can be specified in a special way in the list of routes.

```ts
const route = [
  // ...other routes,
  {
    name: 'not-found',
    path: '*',
    config: {
      pageComponent: 'notfoundComponentName',
    },
  },
];
```

### ROUTE_RESOLVE_TOKEN

Allows you to define an asynchronous function that returns a route object that will be called if no suitable static route was found in the application.

### ROUTE_TRANSFORM_TOKEN

Transformer function for application routes (set statically and those that will be loaded via ROUTE_RESOLVE_TOKEN)

### Method of setting when actions should be performed during SPA transitions

By default, SPA transitions execute actions after defining the next route, but before the actual transition, which allows the page to be displayed immediately with new data, but can cause a noticeable visual lag if the actions are taken long enough.

It is possible to change the behavior and make the execution of actions after the transition itself. Then, when developing components, you will need to take into account that data will be loaded as it becomes available.

Configurable explicitly when using the routing module:

```ts
import { createApp } from '@tramvai/core';
import { SpaRouterModule } from '@tramvai/module-router';

createApp({
  modules: [
    // ...,
    SpaRouterModule.forRoot([], {
      spaActionsMode: 'after', // default is 'before'
    }),
  ],
});
```

or through token `ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN`:

```ts
import { ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN } from '@tramvai/module-router';
import { provide } from '@tramvai/core';

const providers = [
  // ...,
  provide({
    provide: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
    useValue: 'after',
  }),
];
```

## How to

### Working with navigation in providers and actions

In this case, it is best to use the [PAGE_SERVICE_TOKEN](#page_service_token)

```ts
import { provide, createAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/module-router';

const provider = provide({
  provide: 'token',
  useFactory: ({ pageService }) => {
    if (pageService().getCurrentUrl().pathname === '/test/') {
      return pageService.navigate({ url: '/redirect/', replace: true });
    }
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});

const action = createAction({
  name: 'action',
  fn: (_, __, { pageService }) => {
    if (pageService.getConfig().pageComponent === 'pageComponent') {
      return page.updateCurrentRoute({ query: { test: 'true' } });
    }
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
```

### Working with navigation in React components

You can work with routing inside React components using hooks and components - `useNavigate`, `useRoute`, `Link` from the [@tinkoff/router](references/libs/router.md#интеграция-с-react)

<p>
<details>
<summary>An example of working with navigation in the application</summary>

@inline ../../../examples/how-to/router-navigate/index.tsx

</details>
</p>

### How to set static routes

[RouterModule](references/modules/router.md) allows you to add new routes when configuring your application.
The second way is to pass static routes to DI via the `ROUTES_TOKEN` token.

<p>
<details>
<summary>An example of adding static routes to an application</summary>

@inline ../../../examples/how-to/router-static-routes/index.tsx

</details>
</p>

### How to set Route Guard

[ROUTER_GUARD_TOKEN](references/modules/router.md#router_guard_token) is set as an asynchronous function, which allows you to perform various actions and influence the routing behavior.

<p>
<details>
<summary>Example router guards job in application</summary>

@inline ../../../examples/how-to/router-guards/index.tsx

</details>
</p>

### How to set the Not found route

The Not found route is used if the corresponding route is not found for the url.

Such a route is specified in the list of routes with the special `*` character in the `path` property.

<p>
<details>
<summary>An example of setting a Not Found route in an application</summary>

@inline ../../../examples/how-to/router-not-found/index.tsx

</details>
</p>

### How to change Not found route response status

By default, responses for the Not found route return a status of 200.
You can change status in custom Route Guard, by using `RESPONSE_MANAGER_TOKEN`.

<p>
<details>
<summary>An example of changing a Not Found route response status</summary>

@inline ../../../examples/how-to/router-not-found-custom-status/index.tsx

</details>
</p>

### How to change response status in actions

For example, you make a important request in action, and if this request will fail, application need to return 500 or 404 status.

Page actions running after router navigation flow, when route is completely resolved.
You can change status by using `RESPONSE_MANAGER_TOKEN`.
If you want to prevent page component rendering, you can throw `NotFoundError` from `@tinkoff/errors` library.

<p>
<details>
<summary>An example of changing response status in actions</summary>

@inline ../../../examples/how-to/router-action-error/index.tsx

</details>
</p>

### Testing

#### Testing ROUTER_GUARD_TOKEN extensions

If you have a module or providers that define `ROUTER_GUARD_TOKEN`, then it will be convenient to use special utilities to test them separately

```ts
import { ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';
import { testGuard } from '@tramvai/module-router/tests';
import { CustomModule } from './module';
import { providers } from './providers';

describe('router guards', () => {
  it('should redirect from guard', async () => {
    const { router } = testGuard({
      providers,
    });

    await router.navigate('/test/');

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/redirect/',
    });
  });

  it('should block navigation', async () => {
    const { router } = testGuard({
      modules: [CustomModule],
    });

    expect(router.getCurrentUrl()).toMatchObject({ path: '/' });

    await router.navigate('/test/').catch(() => null);

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/',
    });
  });
});
```

## Exported tokens

[link](references/tokens/router-tokens.md)
