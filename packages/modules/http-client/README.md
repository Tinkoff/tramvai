# @tramvai/module-http-client

The module provides the application with a factory of HTTP clients, a basic service for working with various APIs and a service for working with `papi`.

Link to complete HTTP clients documentation - https://tramvai.dev/docs/features/data-fetching/http-client/

## Installation

You need to install `@tramvai/module-http-client`

```bash
yarn add @tramvai/module-http-client
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { HttpClientModule } from '@tramvai/module-http-client';

createApp({
  name: 'tincoin',
  modules: [HttpClientModule],
});
```

## Explanation

The module implements interfaces from the library [@tramvai/http-client](references/libs/http-client.md) using a special library - adapter [@tramvai/tinkoff-request-http-client-adapter](references/libs/tinkoff-request-http-client-adapter.md), running on top of [@tinkoff/request](https://tinkoff.github.io/tinkoff-request/).
