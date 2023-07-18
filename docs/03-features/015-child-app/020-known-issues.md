---
id: known-issues
title: Known Issues
---

### This Suspense boundary received an update before it finished hydrating

When `React` >= `18` version is used, child-app will be wrapped in `Suspense` boundary for [Selective Hydration](https://github.com/reactwg/react-18/discussions/130). This optimization can significantly decrease Total Blocking Time metric of the page.

There is one drawback of this optimization - if you will try rerender child-app during selective hydration, `React` will switch to deopt mode and made full client-rendering of the child-app component. Potential ways to fix this problem [described here](https://github.com/facebook/react/issues/24476#issuecomment-1127800350). `ChildApp` component already wrapped in `React.memo`.

Few advices to avoid this problem:

- Memoize object, passed to child-app `props` property
- Prevent pass to child-app properties, which can be changed during hydration, for example at client-side in page actions

### Shared dependency are still loaded although the root-app shares it

Refer to the [FAQ](#faq-about-shared-dependencies) about the details. In summary:

- it is more reliable to provide shared dependency from the root-app than relying on sharing between several child-apps
- make sure all versions of the shared dependencies are semver compatible

### Token with name already created!

The issue happens when `@tinkoff/dippy` library is shared due to fact that root-app and child-apps will have separate instances of the same tokens packages with the same naming.

For now, just ignore that kind of warnings during development. In production these warnings won't be shown

### Possible problems with shared dependency

#### react-query: No QueryClient set, use QueryClientProvider to set one

The issue may happen if there are different instances of `@tramvai/module-react-query` and `@tramvai/react-query` and therefore internal code inside `@tramvai/react-query` resolves React Context that differs from the QueryClient Provided inside `@tramvai/module-react-query`

To resolve the issue:

- when defining shared dependencies add both `@tramvai/module-react-query` and `@tramvai/module-react-query`
- make sure that both packages are used in the root-app (or none) as both instances should resolve to one place and if it isn't apply then for example `@tramvai/react-query` might instantiate with different React Context
- another option would be to add underlying library `@tanstack/react-query` to both child-app and root-app shared dependencies to make sure that required React Context is created only in single instance

### Shared module is not available for eager consumption

`Uncaught Error: Shared module is not available for eager consumption` - this error can occure when:
- Dependency is shared between Child App and Root App
- Dependency is `eager` in Root App configuration (e.g. `@tramvai/core`, `@tramvai/react` and `@tinkoff/dippy`)
- Dependency in Child App has **higher** version than same dependency in Root App
- Application running in **production** mode (after deployment or `tramvai start-prod` command, unfortunately you can't catch this issue when use `tramvai start`)
- You have a component loaded by dynamic import (e.g. with `lazy` from `@tramvai/react`) and this component uses some of this shared deps underhood

#### Reason

More information why this problem exists you can find in [Module Federation documentation](https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption)

#### Solution

Simple and fast solution - is to always update Root Application **before** Child Apps. If it is not possible, you need to create "async boundary" for application dependencies at the higher level - entry point is good enough for it.

1. At first, create `bootstrap.ts` file near `index.ts`, and copy there all `index.ts` content
1. Then change `index.ts` content to dynamic import of `bootstrap.ts` with `webpackChunkName` magic comment specified
1. At least, add `bootstrap` (use here `webpackChunkName` value) chunk for critical chunks list - `shared.criticalChunks: ['bootstrap']` option in `tramvai.json (it is important to load all main application assets in parallel)

Full example (with simplified content):

import Tabs from '@theme/Tabs'; 
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="index" label="src/index.ts" default>

```tsx title="src/index.ts"
import(/* webpackChunkName: "bootstrap" */ './bootstrap');
```

  </TabItem>
  <TabItem value="bootstrap" label="src/bootstrap.ts" default>

```tsx title="src/bootstrap.ts"
import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { SeoModule } from '@tramvai/module-seo';
import { ServerModule } from '@tramvai/module-server';
import { ErrorInterceptorModule } from '@tramvai/module-error-interceptor';

createApp({
  name: 'tincoin',
  modules: [
    CommonModule,
    SpaRouterModule,
    RenderModule,
    SeoModule,
    ServerModule,
    ErrorInterceptorModule,
  ],
  providers: [],
});
```

  </TabItem>
  <TabItem value="tramvai" label="tramvai.json" default>

```json title="tramvai.json"
{
  "$schema": "../../node_modules/@tramvai/cli/schema.json",
  "projects": {
    "root-app": {
      "name": "tincoin",
      "root": "src",
      "type": "application",
      "shared": {
        "criticalChunks": ["bootstrap"]
      }
    },
  }
}
```

  </TabItem>
</Tabs>
