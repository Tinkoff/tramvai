---
id: how-create-bundle
title: How to create a bundle?
---

Bundle — is a collection of resources for pages: components, actions, stocks.
Each route is associated with some bundle it needs to display.

Let's use a case study: we have a new section on our site, and we want to create a new bundle with separate pages.

Creating and connecting the bundle consists of three steps:

1. Creating a bundle
2. Adding components
3. Connecting in the application

### Creating a bundle

We use the `createBundle` method and create an empty bundle, in which we write the `name` field, which is the unique identifier of the bundle:

```tsx
import { createBundle } from '@tramvai/core';

export default createBundle({
  name: 'coin',
  components: {},
});
```

### Adding components

The next step is to add the components that will be available in this bundle.
We recommended to use `lazy` and dynamic import page components for effective code splitting.
The key is the identifier of the component, this identifier can be bound to the router:

```tsx
import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

const MainPage = lazy(() => import('../pages/main'));
import Layout from '../layouts';


export default createBundle({
  name: 'coin',
  components: {
    'page/coin-main': MainPage,
    'layout/coin-layout': Layout,
  },
});
```

You can register any components for different purposes.
For example, we can register components of modal windows, popups and so on in the bundle.
All these components will be available in the `componentRegistry`.

### Connecting in the application

Now we have to register the bundle in the application. To do this we add to the `bundles` object of `createApp`:
* `key`: the identifier of the bundle. The last part must be the same as the bundle ID passed to `name`, a function of the form `last('platform/coin'.split('/'))` is used there, otherwise, there will be no loading of the bundle on the server side.
* `value`: the function that should return the promise wrapped bundle object. Usually, asynchronous webpack chunks are used, but you can also write a custom loader of regular js files. The important thing is that the name of the chunk, must be synchronized with the `name` identifier

```tsx
import { createApp } from '@tramvai/core';

createApp({
  bundles: {
    'platform/coin': () => import(/* webpackChunkName: "coin" */ './bundles/coin'),
  },
});
```

After that, we will have a bundle available in the application and after downloading it, the linked components will be available. Then we can use these components in routing

* [Complete documentation about createBundle](references/tramvai/core.md#createBundle)
* [Complete documentation about createApp](references/tramvai/core.md#createApp)

## Defaul bundle

The default bundle allows you to handle all (created via `RouterModule.forRoot`) urls for which no bundle is specifically set.
It is done like this:

Inside index.ts

```tsx
import { createApp } from '@tramvai/core';

createApp({
  name: 'myApp',
  modules: [
    // ...
  ],
  providers: [
    // ...
  ],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault'),
  },
});
```

In file `bundles/mainDefault.ts`

```tsx
import { createBundle } from '@tramvai/core'

import { MainPage } from '../layers/pages/MainPage'
import { Layout } from '../layers/layout/Layout'

export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: MainPage,
    layoutDefault: Layout,
  },
})
```
