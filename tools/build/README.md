# @tramvai/build

Library for building `production` ready bundles for packages written in TypeScript targetting next environments:

- NodeJS
- Bundlers (Webpack, etc.)
- Browsers

## Installation

Install `@tramvai/build` first:

```bash npm2yarn
npm install --save-dev @tramvai/build
```

## Get started

Add necessary fields to `package.json`:

```json
{
  "main": "lib/index.js",
  "module": "lib/index.es.js",
  "typings": "lib/index.d.ts",
  "sideEffects": false,
  "files": [
    "lib"
  ]
}
```

> `"main": "lib/index.js"` based on that field lib calculates entry point for the build and it will be `"src/index.ts"` in this case

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "module": "ESNext",
    "target": "ES2015",
    "allowJs": true,
    "declaration": true,
    "sourceMap": true,
    "importHelpers": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "rootDir": "./src",
    "outDir": "./lib",
    "declarationDir": "./lib",
    "types": ["node"],
    "lib": [
      "es2015",
      "es2016",
      "es2017",
      "es2018",
      "dom"
    ]
  },
  "include": ["./src"],
  "exclude": [
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

Add to `dependencies` library [tslib](https://www.npmjs.com/package/tslib):

```bash npm2yarn
npm install tslib
```

Build package with command `tramvai-build`:

```bash
tramvai-build --preserveModules --forPublish
```

> with flag `--preserveModules` tramvai-build wil preserve file structure of library modules for better tree-shaking

> with flag `--forPublish` tramvai-build replaces some fields in `package.json` in order to make built package usable in the end apps, for example `"browser"` field with object value can be updated`

## Explanation

The main purpose for the lib is the effective `production` build for TypeScript package using [rollup](https://rollupjs.org/), with [watch](https://rollupjs.org/guide/en/#rollupwatch) mode support.

Such builds, especially for monorepositories with big number of packages, can take a long time and are not very comfortable to work. Thats why, for the `development` environment it is preferred to use [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) with [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) and [incremental build](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag).

Recommended and automatically generated `package.json` for `@tramvai/build` allows apps to use packages that were built either with `tsc`, or with `@tramvai/build` without any additional steps.

All of the built bundles will contain `ES2019` standard code, it is expected that they will be bundled to `ES5` using bundler (Webpack, etc.) with configured transpilation through `babel` for packages inside `node_modules`, written in modern JS.

### NodeJS bundle in CommonJs format

NodeJS before 12 version hasn't supported ES modules or supported it only behind special flag. `@tramvai/build` generates bundle in `ES2019` standard in `CommonJS` format automatically. Name of the result bundle is taken from field `main` in `package.json`, e.g. `lib/index.js`.

When bundling package in the app using `webpack` with option `target: 'node'` this `CommonJS` bundle probably will not be used as webpack will prefer to use `module` field while resolving source code.

> It is expected that bundle from field `"main"` will be resolved only by `NodeJS` itself while bundlers will use bundle from field `"module"`

### Bundle for bundlers (Webpack, etc.) in ES modules format

Modern bundlers support ES modules and non-standard field `"module"` in `package.json`. `@tramvai/build` generates bundle in `ES2019` standard in `ES modules` format automatically. Name of the result bundle is calculates from field `main` in `package.json` by adding postfix `.es` e.g. `lib/index.es.js`.

If build was called with flag `--forPublish` to `package.json` will be added new field `"module": "lib/index.es.js"`.

When bundling package in the app through `webpack` with option `target: 'node'` bundle from field `module` will have higher priority over bundle from `main`.

> `ES2019` code standard is generated as it is expected that bundle from field `"module"` will be resolved by bundler with configured transpilation through `babel` for packages inside `node_modules`, written in modern JS. Why we still prefer to use `ES5` code over `ES2019`? Apparently, code in `ES5` is still notably faster on NodeJS server. In the same time output bundle size is not important on server.

### Bundle for browsers

Modern bundlers support ES modules and non-standard field `"browser"` in `package.json`. When field `browser` in specified in `package.json`, `@tramvai/build` will generate bundle in `ES2019` standard in `ES modules` format.

If field `browser` in `package.json` is defined as a string then this string determines entry point to `browser` bundle and its name. E.g. when `"browser": "lib/browser.js"` entry point will be `src/browser.ts` and bundle will have a name `lib/browser.js`.

Otherwise, if field `browser` is defined as an object and build was called with flag `--forPublish` then name is defined by the field `main` in `package.json` with adding postfix `.browser` e.g. `lib/index.browser.js`. After that to field `browser` new property will be added as pointer for bundlers to bundle for the browser, instead of the field `module`:

```json
{
  "browser": {
    ...,
    "./index.es.js": "./index.browser.js"
  }
}
```

> Specification for the field [browser](https://github.com/defunctzombie/package-browser-field-spec)

> `ES2019` code standard is generated as it is expected that bundle from `"browser"` field will be resolved by bundler with configured transpilation through `babel` for packages inside `node_modules` written in modern JS to the code according to the `browserslist` config.

When building our package in the app with `webpack` with option `target: 'web'` bundle from field `browser` will be prioritized over field `module`.

### Copy static assets

For every build, all of the non JS/TS/JSON files (e.g. CSS, fonts, images) are copied to the output bundle preserving their relative paths (e.g. `src/css/style.css` -> `lib/css/style.css`). You can disable such copying by using flag `copyStaticAssets`:

```bash
tramvai-build --copyStaticAssets false
```

### Build and copy migrations

When directory `migrations` has any code files they are considered as migration files. These files will be compiled to `.js` and copied to directory `__migrations__`.

## CLI

### Single build

```bash
tramvai-build
```

### Build in watch mode

```bash
tramvai-build --watch
```

### Copy static assets

```bash
tramvai-copy
```

### Available flags

```bash
tramvai-build --help
```

## JavaScript API

### TramvaiBuild

`TramvaiBuild` is used to configure build process for following usage.

```ts
import { TramvaiBuild } from '@tramvai/build';

new TramvaiBuild(options);
```

**Available options:**

@inline src/options.h.ts

### Build

Method `TramvaiBuild.start` builds package either single time or in `watch` mode depending on configuration of `TramvaiBuild`:

```ts
import { TramvaiBuild } from '@tramvai/build';

new TramvaiBuild(options).start();
```

### Copy static files

Method `TramvaiBuild.copy` copies static assets to the `output` directory:

```ts
import { TramvaiBuild } from '@tramvai/build';

new TramvaiBuild(options).copy();
```

## How to

### Build separate bundle for browsers

Let's say we have to entry points. One is for the server - `src/server.ts` and for the client - `src/browser.ts`. In this case we should set field `browser` in `package.json` the next way:

```json
{
  "main": "lib/server.js",
  "browser": "lib/browser.js"
}
```

After build for publication we will get next `package.json`:

```json
{
  "main": "lib/server.js",
  "browser": "lib/browser.js",
  "typings": "lib/server.d.ts",
  "module": "lib/server.es.js"
}
```

### Replace specific module for browser bundle

Let's say we have one entry point - `src/index.ts` and a module `src/external.ts` we want to replace by `src/external.browser.ts`. In this case we should set field `browser` in `package.json` the next way:

```json
{
  "main": "lib/index.js",
  "browser": {
    "./lib/external.js": "./lib/external.browser.js"
  }
}
```

After build for publication we will get next `package.json`:

```json
{
  "main": "lib/index.js",
  "browser": {
    "./lib/external.js": "./lib/external.browser.js",
    "./lib/index.es.js": "./lib/index.browser.js"
  },
  "typings": "lib/index.d.ts",
  "module": "lib/index.es.js"
}
```

### Build all of the packages in monorepo in watch mode

@TODO + link to `@tinkoff/fix-ts-references`

### Import module only under some circumstances or put module to separate chunk

Instead of static imports you can use dynamic import or require. In this case imported module will be build in the separate chunk. Later this chunk can be added by bundler to the generated bundle and if dynamic import was used it will be separate chunk as well after bundlers build, but when using require separate chunk will not be generated.

```tsx
let func = noop;

if (process.env.NODE_ENV !== 'production') {
  func = require('./realFunc').func;
}

export { func };
```

### Use JSON in package

By default in root `tsconfig.json` option `resolveJsonModule` is enabled. It is allows to import json-files the same way as usual source code using `import`, moreover typecheck and tree-shaking will work to json as well when publishing package. To disable ts errors for json imports add to `tsconfig.json` of the package new entry to field `includes`:

```json
{
  "includes": ["./src", "./src/**/*.json"]
}
```

### Use assets file in the package (e.g. css, svg)

These files are not used in bundle or source code and ts will ignore them. For proper package usage additional setup should be done. Add script `tramvai-copy` to `package.json`:

```json
{
  "scripts": {
    "copy-static-assets": "tramvai-copy"
  }
}
```

This script will copy not related files to source code to the output directory. Copying itself happens either on dependencies install in the repository root or on package publishing. As for some reasons output directory might be deleted it may be needed to rerun `tramvai-copy` command for package.

### Use css-modules

In order to disable typescript errors for css-modules imports add new file `typings.d.ts` to the `src` folder with the next content:

```tsx
declare module '*.css' {
  const value: any;
  export default value;
}
```

To copy css while deb-build change next command:

```json
"watch": "tramvai-copy && tsc -w"
```

Such imports are not compiled. To use it properly you can use `@tramvai/cli` for building app or any other solution for the css-modules.

> When building correctness of imports for the css is not checking so check your package manually before publication.

### Build only migrations or tests

If you need to build only migrations or tests files then you can specify option `--only` with either `migrations` or `tests` value.

```bash
tramvai-build --only migrations
tramvai-build --only tests
```
