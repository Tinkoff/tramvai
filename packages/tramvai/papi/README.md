# @tramvai/papi

Библиотека для создания и работы с методами papi.

## Подключение

Необходимо установить `@tramvai/papi`

```bash
yarn add @tramvai/module-papi
```

## Использование

```tsx
import { createPapiMethod } from '@tramvai/papi';

export const papi = createPapiMethod({
  path: '/my/papi',
  method: 'post',
  async handler(deps) {
    return 'test';
  },
  deps: {
    tinkoffApiService: TINKOFF_API_SERVICE,
  },
});
```
