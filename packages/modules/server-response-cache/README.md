# Server response cache

Caches the responses from the server for the requests in order to respond quickly

## Installation

You need to install `@tramvai/module-server-response-cache`

```bash npm2yarn
npm i --save @tramvai/module-server-response-cache
```

And connect to the project

```tsx
import { createApp } from '@tramvai/core';
import { ServerResponseCacheModule } from '@tramvai/module-server-response-cache';

createApp({
  name: 'tincoin',
  modules: [ServerResponseCacheModule],
});
```

## Explanation

Module mostly focused on providing high RPS for the server by disabling part of the functionality on ssr and caching non-personalized requests.

:::warning

This type of caching implies no personalization for the individual requests. That means a lot of requests will be served as anonymous pages without most of the ssr preparations for the client. Be sure your app can successfully dehydrate on the client in this case and can load any additional data required to the end user in browser.

:::

### Getting from cache

Conditions when value is returned from cache:

- if there any value in cache
- call of the [`RESPONSE_CACHE_SHOULD_USE_CACHE`](#response_cache_should_use_cache) returns true

### Running full ssr to fill cache

- In case there is no value cache
- In case there is value in cache, but its ttl is outdated. In this case the cached value will still be send to client, but it will be updated in the background.

### Setting to cache

- We have served response
- After response is sent call [`RESPONSE_CACHE_SHOULD_SET_TO_CACHE`](#response_cache_should_set_to_cache) to check if response should be cached

### Options

- `ttl` - time to live of the cache entry. 1 minute by default.
- `maxSize` - max number of entries in cache. 50 entries by default
- `line` - specify the commandLine to execute checking cache. Might be used in case you need some additional data from di that is filled on next lines. By default cache check is executed on `customerStart`

## How to

## Exported tokens

### RESPONSE_CACHE_SHOULD_USE_CACHE

Function that returns flag that current request should be handled by cache.

Default: always true.

### RESPONSE_CACHE_GET_CACHE_KEY

Function that return string that is used as cache key.

Default: request pathname + deviceType (mobile or desktop)

### RESPONSE_CACHE_SHOULD_SET_TO_CACHE

Function that return flag that current response should be cache. As some requests may contain personal info for the client not every response can be cache.

Default: true if there is no cookies for the request

### RESPONSE_CACHE_OPTIONS

Specify [response cache options](#options)
