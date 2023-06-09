---
id: add-child-app-without-cli
title: Add Child App without CLI
---

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
