---
id: hooks-and-guards
title: Hooks and Guards
---

## Guards

Guards allow you to control the availability of a particular route for a specific transition. From the guard, you can block the transition or initiate a redirect.

Example:

```ts
import { provide } from '@tramvai/core';
import { ROUTER_GUARD_TOKEN } from '@tramvai/module-router';

const provider = provide({
  provide: ROUTER_GUARD_TOKEN,
  useValue: async ({ to }) => {
    if (to.config.blocked) {
      return false; // block this transition
    }

    if (typeof to.config.redirect === 'string') {
      return to.config.redirect; // call a redirect to the specified page
    }

    if (typeof to.config.needAuth && !isAuth()) {
      return { url: '/login/', code: '302' }; // redirect to page with NavigateOptions
    }

    // if nothing is returned, the transition will be performed as usual
  },
});
```

### Rules

- guards are asynchronous and it execution will be awaited inside routing
- all guards are running in parallel and they are all awaited
- if several guards return something then the result from a guard that was registered early will be used

### Possible result

The behaviour of routing depends on the result of executing guards functions and there result might be next:

- if all of the guards returns `undefined` then navigation will continue executing
- if any of the guards returns `false` then navigation is blocked and next action differs on server and client
- if any of the guards returns `string` it is considered as url to which redirect should be happen
- if any of the guards returns [`NavigateOptions`](03-features/07-routing/04-links-and-navigation.md#navigateoptions) interface, `url` property from it is considered as url to which redirect should be happen

## Hooks

:::info

Hooks are not recommended to usage because you can easy slow down application response time.
Always prefer commandLineRunner, Actions or Guards if it is possible.

:::

Transition hooks allow you to perform your asynchronous actions at different stages of the transition.

There is a few steps to add transition hooks:

1. Get router instance with `ROUTER_TOKEN` token
2. Use methods `registerHook`, `registerSyncHook` to add new hooks to the router
3. Registration should happen as soon as possible so appropriate command line is `customerStart` as it executes before navigation happens.

Example:

```ts
import { provide, commandLineListTokens } from '@tramvai/core';
import { beforeNavigateHooksToken } from '@tramvai/module-router';

const provider = provide({
  provide: beforeNavigateHooksToken,
  useValue: async ({ from, to, url, fromUrl }) => {
    console.log(`navigating from ${from} to route ${to}`);
  },
});
```

### Rules

- all hooks from the same event are running in parallel
- most of the hooks are asynchronous and are awaited inside router
- if some error happens when running hook it will be logged to console but wont affect navigation (except for the `beforeResolve` hook - error for it will be rethrown)

### List of available hooks

Async hooks:

- **navigate hooks** - asynchronous hooks only for `navigate` calls:

  - `beforeResolve`
  - `beforeNavigate`
  - `afterNavigate`

- **updateCurrentRoute hooks** - asynchronous hooks only for `updateCurrentRoute` calls:

  - `beforeUpdateCurrent`
  - `afterUpdateCurrent`

Sync hooks:

- `change` - runs when any of changes to current route\url happens
