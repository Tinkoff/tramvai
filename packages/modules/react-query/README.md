# ReactQuery

A module that adds integration with the [react-query](https://react-query.tanstack.com/) library and is required for [@tramvai/react-query](references/tramvai/react-query.md)

## Installation

You need to install `@tramvai/module-react-query`

```bash
yarn add @tramvai/module-react-query
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { ReactQueryModule } from '@tramvai/module-react-query';

createApp({
  name: 'tincoin',
  modules: [...ReactQueryModule],
});
```

## Explanation

The module adds an instance [react-query QueryClient](https://react-query.tanstack.com/reference/QueryClient) to the DI и and allows specifying [options for creating it](https://react-query.tanstack.com/reference/QueryClient#queryclientsetdefaultoptions).

The module also adds [React wrappers for react-query](https://react-query.tanstack.com/reference/QueryClientProvider) to the application renderer, which allow using functions for working with query inside components.

### Server

On the server, the module also additionally performs dehydration of the data preloaded on the server in order to transfer them to the client

### Client

The browser additionally performs rehydration of the data preloaded on the server

## API

The module basically provides the necessary things in DI for the library [@tramvai/react-query](references/tramvai/react-query.md) and itself may be needed only if there is a need to change the settings for QueryClient or use QueryClient directly (but better not to use directly)

## How to

### Enable devtools

[React-query devtools](https://react-query.tanstack.com/devtools) are provided through `@tramvai/module-dev-tools` and to enable it both modules should be passed to modules list:

```ts
import { ReactQueryModule, ReactQueryDevtoolsModule } from '@tramvai/module-react-query';
import { DevToolsModule } from '@tramvai/module-dev-tools';

createApp({
  name: 'app',
  modules: [
    ...modules,
    ReactQueryModule,
    ...(process.env.NODE_ENV === 'development' ? [DevToolsModule, ReactQueryDevtoolsModule] : []),
  ],
  bundles: {},
  providers: [],
});
```

## Exported tokens

@inline src/tokens.ts
