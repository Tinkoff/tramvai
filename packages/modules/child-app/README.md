# @tramvai/module-child-app

Module for child app

Link to complete Child-App documentation - https://tramvai.dev/docs/features/child-app/app-integration/


## Installation

First, install `@tramvai/module-child-app`

```bash
npx tramvai add @tramvai/module-child-app
```

And then add module to your app

```tsx
import { createApp } from '@tramvai/core';
import { ChildAppModule } from '@tramvai/module-child-app';

createApp({
  name: 'tincoin',
  modules: [ChildAppModule],
});
```
