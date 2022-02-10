---
id: how-create-child-app
title: How to create Child App?
---

## Initialization

### @tramvai/cli

1. Run in your shell

```sh
tramvai new [name]
```

1. Choose `Microfrontend implemented by tramvai child-app`
1. Follow next steps of setup based on your needs

After that in directory `[name]` will be generated new child-app from template with all necessary setup.

You can use commands `tramvai start/tramvai build` to start/build your new child-app.

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

### Testing

#### Unit

You may use helper library [@tramvai/test-child-app](references/tramvai/test/child-app.md) that creates mock application in order to test child-app behaviour in the app.

#### Integration Tests

Full testing requires to run standalone app that will reuse your app.

1. Create test app in your repository. Also you may use `@tramvai/test-trandapp` for generating simple app without hassle (not yet available in open-source).
2. Using [@tramvai/test-integration](references/tramvai/test/integration.md) and [@tramvai/test-puppeteer](references/tramvai/test/puppeteer.md) you may perform any kind of tests including testing in browser.

### Deploy

1. Build your child-app with command `tramvai build [name]`
2. Copy generated files from `./dist/child-app` (by default) to the external cdn
3. Provide link to the cdn itself through token `CHILD_APP_RESOLVE_BASE_URL_TOKEN` or env `CHILD_APP_EXTERNAL_URL`
