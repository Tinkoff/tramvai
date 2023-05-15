---
title: Caching
---

## Back/Forward Cache

Browser optimization for instant back and forward navigations for previously loaded pages. More details on it see on [web.dev](https://web.dev/bfcache/)

To enable/disable bfcache for tramvai app (under hood it disables/enables `no-store` value for `cache-control` header) use `BACK_FORWARD_CACHE_ENABLED` token from render module.

```ts
import { BACK_FORWARD_CACHE_ENABLED } from '@tramvai/tokens-render';

const providers = [
  {
    provide: BACK_FORWARD_CACHE_ENABLED,
    useValue: false,
  },
];
```

### Troubleshooting

#### bfcache is not applied when enabled

Some of the used features on the page may block the page from putting it to the bfcache. tramvai framework tries to

To explore what is blocking the page refer to [docs](https://web.dev/bfcache/?utm_source=devtools#optimize-your-pages-for-bfcache) and use DevTools functionality to test out bfcache appliance.
