---
id: how-create-child-app
title: How to create Child App?
---

## Initialization

<!-- Not implemented yet
### @tramvai/cli

Run in your shell

```sh
tramvai new:child-app [name]
``` -->

### Step By Step

1. Create new repo
1. Init package-manager
1. Add necessarily package for child app
   ```sh
     yarn add --dev @tramvai/cli
     yarn add @tramvai/child-app-core
   ```
1. Create new file `tramvai.json` in the root with following content
   ```json
   {
     "$schema": "./node_modules/@tramvai/cli/schema.json",
     "projects": {
       "[name]": {
         "name": "[name]",
         "root": "src",
         "type": "child-app"
       }
     }
   }
   ```
1. Add scripts to `package.json` for run child in dev and prod mode:

   ```json
   {
     "scripts": {
       "start": "tramvai start [name]",
       "build": "tramvai build [name]"
     }
   }
   ```

1. Implement your React-component wrapper (for example in `./src/component.tsx`)
1. Add new file `./src/entry.ts` for you app with following content:

   ```ts
   import { createChildApp } from '@tramvai/child-app-core';
   import { ChildAppComponent } from './component';

   // eslint-disable-next-line import/no-default-export
   export default createChildApp({
     name: '[name]',
     modules: [],
     render: ChildAppComponent,
   });
   ```

## Development

### Add new functionality

Child App should mostly reuse functionality from root app through di inheritance (it happens automatically) in cases when it is appropriate. But in order to properly work, some of the modules need a special wrapper module for child app (usually such a wrapper is needed when module functionality in used in React). In this case check interested module documentation on presence of such a wrapper module for a child app.

If your child app has some specific functionality you may implement it the way you want: through module, provider, actions or inside React-component. Just make sure you are reusing as much functionality from root app as possible and you are adding as little code as needed to produce smallest possible child-app script.

### Deploy

@TODO
