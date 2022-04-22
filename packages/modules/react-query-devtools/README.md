# ReactQueryDevtools

[React-query devtools](https://react-query.tanstack.com/devtools) integration

## Installation

You need to install `@tramvai/module-react-query-devtools`

```bash
yarn add @tramvai/module-react-query-devtools
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { ReactQueryDevtoolsModule } from '@tramvai/module-react-query-devtools';

createApp({
  name: 'tincoin',
  modules: [...(process.env.NODE_ENV === 'development' ? [ReactQueryDevtoolsModule] : [])],
});
```
