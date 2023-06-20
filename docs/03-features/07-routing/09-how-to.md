---
id: how-to
title: How-to
---

### Setting when actions should be performed during SPA transitions

By default, SPA transitions execute actions after defining the next route and after the actual transition. It is possible to change this behavior and make the execution of actions before a transition itself. Note, that in this case a page will be displayed immediately with new data, but it can cause a noticeable visual lag if actions are taken long enough.

Configurable explicitly when using the routing module:

```ts
import { createApp } from '@tramvai/core';
import { SpaRouterModule } from '@tramvai/module-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([], {
      spaActionsMode: 'before', // default is 'after'
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
    useValue: 'before',
  }),
];
```

### Load route config from external api

Create `ROUTE_RESOLVE_TOKEN` provider, where you need to fetch and return new route object (route will be registered in `beforeResolve` transition hook):

```ts
import { provide } from '@tramvai/core';
import { ROUTE_RESOLVE_TOKEN } from '@tramvai/module-router';

const provider = provide({
  provide: ROUTE_RESOLVE_TOKEN,
  // will be executed for every navigation, when corresponding route is not defined in application
  useValue: async (navigation) => {
    const route = await fetchRouteFromExternalApi(navigation);

    if (route) {
      return route;
    }
  },
});
```

### How to transform every route befor usage

Create `ROUTE_TRANSFORM_TOKEN` multi provider, where you can change route object directly:

```ts
import { provide } from '@tramvai/core';
import { ROUTE_TRANSFORM_TOKEN } from '@tramvai/module-router';

const provider = provide({
  provide: ROUTE_TRANSFORM_TOKEN,
  // in this example, paths for every routes will be modified
  useValue: (route) => {
    return {
      ...route,
      path: `/prefix${route.path}`,
    };
  },
});
```

### App behind proxy

Router doesn't support proxy setup directly. But proxy still can be used with some limitations:

- setup proxy server to pass requests to app with rewriting request and response paths. (E.g. for [nginx](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_redirect))
- it wont work as expected on spa navigation on client, so only option in this case is use the `NoSpaRouter`
