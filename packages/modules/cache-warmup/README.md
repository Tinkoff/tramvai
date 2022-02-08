# Cache warmup

Module to execute warmup of the cache when app starts.

## Installation

By default, the module is already included in `@tramvai/module-server` and no additional actions are needed.

```tsx
import { createApp } from '@tramvai/core';
import { CacheWarmupModule } from '@tramvai/module-cache-warmup';

createApp({
  modules: [CacheWarmupModule],
});
```

## Explanation

> Module is executed only when `NODE_ENV === production`.

1. When app starts the module will request list of app urls from papi-route `bundleInfo`.
2. For every url from the response it sends `2` requests: one for mobile and one for desktop device. But only `2` requests are running simultaneously in total.

### User-agent

In order to emulate mobile or desktop device next user-agent strings are used:

```js
[
  /** Chrome on Mac OS */
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
  /**  Chrome on Mobile */
  'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36',
];
```

## Debug

This module logs with id `cache-warmup`
