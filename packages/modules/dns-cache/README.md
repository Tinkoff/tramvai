# @tramvai/module-dns-cache


DNS lookup cache for Node.js - [cacheable-lookup](https://github.com/szmarczak/cacheable-lookup) library integration.

## Explanation

DNS lookup cache can speed up your server-side HTTP requests to external API's.

Usually, DNS lookup is a fast process, but Node.js (`libuv` under the hood) has a [default limit of 4 concurrent threads](https://nodejs.org/docs/latest-v18.x/api/cli.html#uv_threadpool_sizesize), used for a [set of synchronous operations](https://nodejs.org/en/docs/guides/dont-block-the-event-loop), including DNS lookup, so lookup can be queued. Or if application is under high load, or while any network problems, DNS lookup time can be increased.

First main optimization of HTTP connections is already used in `tramvai` [HTTP clients](03-features/09-data-fetching/02-http-client.md) - [keepAlive option](https://nodejs.org/api/http.html#new-agentoptions) for `http` and `https` agents. With `keepAlive`, TCP sockets are reused for multiple HTTP requests, and count of DNS lookups is decreased dramatically.

Because of that, DNS cache it's a nice and cheap optimization, but don't expect some huge performance boost.

Potential disadvantages - external services can change their IP addresses, and HTTP requests will use outdated DNS cache, you can detect this by search `ENOTFOUND` errors is server logs, so long cache TTL is not recommended.

## Installation

You need to install `@tramvai/module-dns-cache` module:

```bash
npx tramvai add @tramvai/module-dns-cache
```

Then, connect `TramvaiDnsCacheModule` from this package to `createApp` function:

```ts
import { createApp } from '@tramvai/core';
import { TramvaiDnsCacheModule } from '@tramvai/module-dns-cache';

createApp({
  name: 'tincoin',
  modules: [TramvaiDnsCacheModule],
});
```

## Configuration

### Enable/disable

By default, DNS lookup cache is **enabled**.

To disable it, you need to provide `DNS_LOOKUP_CACHE_ENABLE` environment variable:

```bash
DNS_LOOKUP_CACHE_ENABLE=false
```

### Cache TTL

Default TTL for DNS lookup cache is 60 seconds. You can change it by providing `DNS_LOOKUP_CACHE_TTL` environment variable:

```bash
DNS_LOOKUP_CACHE_TTL=120000
```

### Cache size

Default cache size is 200 entries. You can change it by providing `DNS_LOOKUP_CACHE_LIMIT` environment variable:

```bash
DNS_LOOKUP_CACHE_LIMIT=500
```
