---
id: create-bundle
title: createBundle
---

`createBundle(options: BundleOptions)` - method to create a bundle.

[Read more about bundles](concepts/bundle.md)

## Properties BundleOptions

- `name` - Name of the bundle. The value will be used as a bundle identifier.
- `components: {}` - An object with registered components for the bundle, which you can use in application routes
- `presets?: []` - A list of additional properties for the current bundle. This list is merged with the current properties. Needed to extract common parts, e.g. a set with actions and components for authorization. Reference - babel and eslint presets
- `actions?: []` - List of [actions](concepts/action.md) that will be registered globally for the bundle
- `reducers?: []` - List of [reducers](features/state/overview.md), which must be registered with the loading of the bundle

## Usage

```tsx
import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

createBundle({
  name: 'app/bundle',
  presets: [commonPreset],
  components: {
    'app/pages/MainPage': lazy(() => import('../pages/MainPage')),
    'app/pages/SecondPage': lazy(() => import('../pages/SecondPage')),
  },
  actions: [fooAction, barAction],
  reducers: [bazReducer],
});
```
