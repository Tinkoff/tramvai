# Cache warmup

Модуль реализующий "прогрев" кэшей при старте приложения.

## Как подключить?

По умолчанию модуль уже подключается в `@tramvai/module-server` и при его использовании дополнительных действий не требуется.

```tsx
import { createApp } from '@tramvai/core';
import { CacheWarmupModule } from '@tramvai/module-cache-warmup';

createApp({
  modules: [CacheWarmupModule],
});
```

## Что делает?

При старте приложения с запрашивает у `bundleInfo` список урлов приложения. Затем шлет по `2` запроса на каждый из урлов, но не более `2` запросов одновременно.

`2` запроса нужны для того, чтобы симулировать запрос с десктопа и мобильного устройства. `User-Agent`ы, которые использует модуль:

```js
[
  /** Chrome on Mac OS */
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
  /**  Chrome on Mobile */
  'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36',
];
```

Модуль выполняется только при `NODE_ENV === production`.

## Отладка

Модуль использует логгер с идентификатором `cache-warmup`
