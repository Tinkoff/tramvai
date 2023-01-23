---
id: not-found
title: Not Found
---

## Usage

`Not Found` route used if no matches were found for the current page, can be specified in a special way in the list of routes.

:::info

Working only with `pages` directory and manual routes configuration, File-System Routing not supported for this moment.

:::

The `path` property of this route must end in an asterisk - `*`, and can be different for nested paths:

```tsx
import { SpaRouterModule } from '@tramvai/modules-router';

createApp({
  modules: [
    SpaRouterModule.forRoot([{
      name: 'not-found',
      path: '*',
      config: {
        pageComponent: '@/pages/not-found',
      },
    }, {
      name: 'comments-not-found',
      path: '/comments/*',
      config: {
        pageComponent: '@/pages/comments-not-found',
      },
    }]),
  ],
});
```

## How To

### Change Not Found route response status

By default, responses for the Not found route return a status of 200. You can change status in custom Route Guard, by using `RESPONSE_MANAGER_TOKEN`:

```ts
import { provide } from '@tramvai/core';
import { ROUTER_GUARD_TOKEN } from '@tramvai/module-router';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';

const provider = provide({
  provide: ROUTER_GUARD_TOKEN,
  useFactory: ({ responseManager }) => {
    return async ({ to }) => {
      // watch all navigations, and wait for route with name `not-found`
      if (to && to.name === 'not-found') {
        // set the response status, it will be applied until the end of the response
        responseManager.setStatus(404);
      }
    }
  },
  deps: {
    responseManager: RESPONSE_MANAGER_TOKEN,
  },
});
```

### Trigger Not Found or change response status in actions

For example, you make a important request in action, and if this request fails, application need to return 500 or 404 status.

Page actions running after router navigation flow, when route is completely resolved. You can change status by using `RESPONSE_MANAGER_TOKEN`. If you want to prevent page component rendering, you can throw `NotFoundError` from `@tinkoff/errors` library.

```ts
import { declareAction } from '@tramvai/core';
import { NotFoundError } from '@tinkoff/errors';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';

const pageAction = declareAction({
  name: 'pageAction',
  async fn() {
    const { responseManager } = this.deps;

    try {
      await fetchSomeData();
    } catch (e) {
      if (isCriticalDataError) {
        // if you throw NotFoundError, Page component will not be rendered, response body will be empty
        throw new NotFoundError();
      } else {
        // otherwise, if you only change response status, Page component will be rendered without neccesary data
        responseManager.setStatus(500);
      }
    }
  },
  deps: {
    responseManager: RESPONSE_MANAGER_TOKEN,
  },
});
```

##### - [Next: Routing - Redirects](03-features/07-routing/07-redirects.md)
