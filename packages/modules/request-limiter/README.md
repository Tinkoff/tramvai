# @tramvai/module-request-limiter

This module provides a request limiter, designed to dynamically limit the number of requests handled concurrently by the application.
Request limiter monitors the application server health through event loop lag checks. 

## Installation

You need to install `@tramvai/module-request-limiter`

```bash npm2yarn
yarn add @tramvai/module-request-limiter
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { RequestLimiterModule } from '@tramvai/module-request-limiter';

createApp({
  name: 'tincoin',
  modules: [ RequestLimiterModule ],
});
```

## Usage

### Activation

To activate the limiter, use token `REQUESTS_LIMITER_ACTIVATE_TOKEN` with `true` value:

```ts
import { REQUESTS_LIMITER_ACTIVATE_TOKEN } from '@tramvai/module-request-limiter';

const provider = {
  provide: REQUESTS_LIMITER_ACTIVATE_TOKEN,
  useValue: true,
};
```

### Configuration

You can pass options to request limiter by `REQUESTS_LIMITER_OPTIONS_TOKEN` token:

```ts
import { REQUESTS_LIMITER_OPTIONS_TOKEN } from '@tramvai/module-request-limiter';

const provider = {
  provide: REQUESTS_LIMITER_OPTIONS_TOKEN,
  // default options
  useValue: {
    limit: 10,
    queue: 100,
    maxEventLoopDelay: 150,
    error: { httpStatus: 429, message: 'Too Many Requests' },
  },
};
```

The basic settings should work well for most applications, as there is a system built in to adapt and automatically change the parameters relative to the loads. As a result, change the settings after you have done a load test and know that the changes will definitely improve the situation


## Explanation

After the server starts, request limiter can handle `options.limit` parallel connections.
Requests over this limit will fall in queue, the size of which limited by `options.queue`.
Other connections that exceed the size of the queue will be terminated with an error `options.error`.

Requests from queue will be processed from the end of the queue. 

Every second limiter checking the current event loop lag.
If current lag exceed the `options.maxEventLoopDelay`, limit number of parallel connections will be decremented.
Otherwise, this limit will be incremented.
