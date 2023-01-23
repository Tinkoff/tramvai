# @tramvai/module-router

Module for routing in the application. Exports two sub-modules: with client SPA transitions, and no-SPA.

Link to complete Router documentation - https://tramvai.dev/docs/features/routing/overview/

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

## Exported tokens

[link](references/tokens/router.md)
