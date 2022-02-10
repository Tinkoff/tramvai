---
title: '@tramvai/papi'
sidebar_position: 4
---

# Papi

Library for creating and working with papi handlers.

## Installation

You need to install `@tramvai/papi`

```bash
yarn add @tramvai/module-papi
```

## Usage

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
