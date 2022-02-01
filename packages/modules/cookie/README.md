# CookieModule

Module for cookie parsing and setting. The module is provided with the `@tramvai/module-common`.

## Installation

Module is already provided with the `@tramvai/module-common` so no additional actions are needed if you are already use common module. Otherwise install `@tramvai/module-cookie` manually.

## Explanation

Implements interface `CookieManager` and adds provider `COOKIE_MANAGER` from the `@tinkoff/core`

### Features

- Isomorphic code that works on server and client
- Uses deduplication for the same cookie entries on server
- Uses secure parameter by default

## How to

### Get cookie

```tsx
import { COOKIE_MANAGER, Module, provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: 'my_module',
      useFactory: ({ cookie }) => {
        cookie.get('sid'); // > ads.api3
      },
      deps: {
        cookie: COOKIE_MANAGER,
      },
    }),
  ],
})
class MyModule {}
```

## Exported tokens

### COOKIE_MANAGER_TOKEN

Instance of cookie manager

```tsx
interface CookieSetOptions {
  name: string;
  value: string;
  expires?: number | Date | string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

interface CookieManager {
  get(name: any): string;
  all(): Record<string, string>;
  set({ name, value, ...options }: CookieSetOptions): void;
  remove(name: string): void;
}
```
