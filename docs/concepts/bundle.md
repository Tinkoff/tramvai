---
id: bundle
title: Bundle
sidebar_position: 7
---

Bundles allow you to select components, reducers and actions common for different pages.
Bundles are registered for the entire application, the name of the current bundle is taken from the current route, if they match, the application initializes the bundle:
- searches in the bundle for components that match the `pageComponent` and `layoutComponent` from the route, saves them to the general case of components, then these components are used by the `RenderModule` when rendering the page
- saves actions to the general action register
- registers new reducers

Interface details [createBundle](references/tramvai/core.md#createBundle)

## Dynamic bundle import

To highlight unnecessary code on each page, each bundle passed to `createApp` must have the signature `() => Promise<{default: Bundle}>`. All the code shared with the modules plugged into the application will remain in the main chunk of the application, and many bundles will weigh only a few KB, but as soon as one of the components of the bundle includes a heavy dependency, for example, a library with forms, it will completely fall into the corresponding bundle.

It is recommended to use [dynamic import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) with the magic comment `webpackChunkName` to specify the name of the new chunk, for example:

```tsx
() => import(/* webpackChunkName: "mainDefault" */ './bundles/mainDefault')
```

## Default bundle

Each route must have properties `bundle` with the name of the bundle, `pageComponent` and `layoutComponent` with the names of the corresponding components.
The default values ​​are as follows:
- `bundle: 'mainDefault'`
- `pageComponent: 'pageDefault'`
- `layoutComponent: 'layoutDefault'`

When using the standard `RenderModule`, the `LayoutModule` is included, which will provide the `layoutDefault` and a separate mechanism for extending and overriding layout in the application, so there is no need to add the `layoutDefault` property to the `components` list of the bundle.

To create a bundle that will run on all application pages that do not have specific route settings, two steps are enough:

#### Create a bundle

```tsx
import { createBundle } from '@tramvai/core';
import { MainPage } from './pages/MainPage';

export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: MainPage,
  },
});
```

#### Connect the bundle

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
