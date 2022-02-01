# DepsGraphModule

> Works only in development mode and shows dependency graph for the server build

Module to show token dependency graph.

## Installation

First install `@tramvai/module-deps-graph`:

```bash npm2yarn
npm i @tramvai/module-deps-graph
```

Add module to the `modules` list

```tsx
import { createApp } from '@tramvai/core';
import { DepsGraphModule } from '@tramvai/module-deps-graph';

createApp({
  modules: [DepsGraphModule],
});
```

## Explanation

### Usage

Module adds papi-route `/deps-graph` that will display dependency graph with the functionality to search by token or module name.

> Actual relative path to the papi-route will be `/:appName/papi/deps-graph` where `appName` - name of the app passed to the `createApp`

### Graph legend

- Blue - usual provider
- Yellow - multi-provider
- Red - provider satisfying to search expression

![img.png](http://s.csssr.ru/UAHCBP6MS/localhost_3000_pfphome_papi_deps-graph_search%3Dboxy%26lines%3Dgenerate_page%252Cinit_-_Google_Chrome_2021-04-13_14.55.05.png)
