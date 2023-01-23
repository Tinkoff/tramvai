# @tinkoff/router

Routing library. It can work both on the server and on the client. Designed primarily for building isomorphic applications.

Link to complete Router documentation - https://tramvai.dev/docs/features/routing/overview/

## Installation

You need to install `@tinkoff/router`:

```bash
yarn add @tinkoff/router
```

And connect it to the project:

```tsx
import { Router, SpaHistory } from '@tinkoff/router';
import { NoSpaRouter } from '@tinkoff/router';

const spaRouter = new Router({ history: new SpaHistory() });
const noSpaRouter = new NoSpaRouter();
```
