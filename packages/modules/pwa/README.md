# @tramvai/module-progressive-web-app

Progressiwe Web App module.

Complete documentation is available in [PWA page](03-features/017-pwa.md).

## Installation

You need to install `@tramvai/module-progressive-web-app` module:

```bash
npx tramvai add @tramvai/module-progressive-web-app
```

Then, connect `TramvaiPwaModule` from this package to `createApp` function:

```ts
import { createApp } from '@tramvai/core';
import { TramvaiPwaModule } from '@tramvai/module-progressive-web-app';

createApp({
  name: 'tincoin',
  modules: [TramvaiPwaModule],
});
```