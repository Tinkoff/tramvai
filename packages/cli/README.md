---
title: '@tramvai/cli'
sidebar_label: 'base'
sidebar_position: 1
---

# Tramvai CLI

CLI interface for resolving actual problems and tasks of frontend CI. Reduces complexity of setting up webpack, typescript, babel, postcss and other tools.

`@tramvai/cli` may build projects to production, run code in development mode with automatic rebuilds, project analyze and code generation

## Installation

Global installation on the developer machine. After that the new command `tramvai` will be available in terminal.

```bash
npm i -g @tramvai/cli
```

Local installation to the project

```bash
npm i --save-dev @tramvai/cli
```

## API

### Commands

After any command you can pass `--help` string, e.g. `tramvai --help` or `tramvai start --help`. After that you will see description of the command and its options.

- `tramvai new` - generate new tramvai app with @tramvai/cli
- `tramvai start` - run app in the development mode
- `tramvai start-prod` - run app in development mode, but code will be build in the production mode
- `tramvai build` - build an app for server and client
- `tramvai static` - generate static HTML for application pages
- `tramvai analyze` - analyze bundle size
- `tramvai generate` - code generation for different components. E.g. new projects, react components, actions and etc.
- `tramvai update` - update `@tramvai/cli` and all of the `@tramvai` and `@tramvai-tinkoff` dependencies in the project. This command additionally executes dependency deduplication and code migrations
- `tramvai add` - add `@tramvai` or `@tramvai-tinkoff` dependency to the app. This command additionally executes dependency deduplication and code migrations

## Explanation

### Notifications settings

Inside `tramvai.json` the settings for the notification can be specified at path `commands.serve.notifications`. Parameters are passed to [webpack-build-notifier](https://github.com/RoccoC/webpack-build-notifier#config-options). You can specify global configuration or a specific configuration either for client or server build.

```json
"commands": {
    "serve": {
      "notifications": {
        "suppressSuccess": "always",
        "server": {
          "suppressWarning": true
        },
        "client": {
          "activateTerminalOnError": true
        }
      }
    }
}
```

### CSS class names generation settings

Name generation is configured via the options `cssLocalIdentNameDev` and `cssLocalIdentNameProd` (common option `cssLocalIdentName` might be used to specify settings for both prod and dev).

```json
"commands": {
  "build": {
    "configurations": {
      "postcss": {
        "cssLocalIdentName": "[hash:base64:5]", // default value (deprecated)
        "cssLocalIdentNameDev": "[name]__[local]_[minicss]", // available values see in the docs to [css-loader](https://github.com/webpack-contrib/css-loader)
        "cssLocalIdentNameProd": "[minicss]", // additionally new tag `minicss` can be used for the generating minimal css names. Based on [article](https://dev.to/denisx/reduce-bundle-size-via-one-letter-css-classname-hash-strategy-10g6)
      };
    };
  };
};
```

### Polyfills for the standard NodeJS modules

By default, `webpack` starting with 5th version, do not add polyfills to browser bundle when using nodejs standard modules in the browser code, e.g. when using _crypto_, _path_, _process_, _buffer_, etc.

`@tramvai/cli` explicitly adds polyfills for _path_ and _process_ modules as these modules are often used and lightweighted.

### Checking TypeScript types

Checking types is enabled by flag `checkAsyncTs`.

When running `tramvai start` ts compilation and type checks will be executed.

Inside `tramvai.json`

```json
"checkAsyncTs": {
  "failOnBuild": true, // optional
  "pluginOptions": {} // optional
},
```

**failOnBuild** adds type checks when running `tramvai build`. This way build will fail in case of wrong types.

**pluginOptions** – [list of the additional options](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options) for the plugin `fork-ts-checker-webpack-plugin`

If you want to override path to tsconfig through **pluginOptions.tsconfig** the option should be specified relative to the `@tramvai/cli` folder itself e.g. _node_modules/@tramvai/cli_. By default tsconfig is expected to be in the project root directory: _\<rootDir\>/tsconfig.json_

### Deduplication of modules

Option `commands.build.configurations.dedupe` controls the settings of plugin for the deduplication process. Available options are:

- `"equality"` - uses strict version comparison. Dedupes modules in `node_modules` with equal package version that are imported from different sources. E.g. imports for `node_modules/package/index.js` and `node_modules/nested-package/node_modules/package/index.js` are deduped into a single `node_modules/package/index.js` import whilst without dedupe it will bundle two files as separate modules.
- `"semver"` - compares version of packages based on semver. It can dedupe all of the imports with the same major version and any of the minor and patch versions. E.g. next versions will be deduped: from `1.14.0` and `1.16.2` to `1.16.2`, from `0.14.1` and `0.16.5` to `0.16.5`, whilst versions `0.0.2` and `0.0.5` will be left without deduplication.
- `false` - disable deduplication, by default

### Debug an app

While developing sometimes it is needed to debug nodejs app directly so see CPU, memory consumptions etc. To do it the options `--debug` might be passed to commands `start` and `start-prod` which do next:

- enables source maps for build on client and server
- starts the server process with the flag [`--inspect`](https://nodejs.org/ru/docs/guides/debugging-getting-started/).

After that you can open debugger in the chrome devtools - `chrome://inspect`

#### Source Maps

`webpack` offers several kind of [sourcemap qualities](https://webpack.js.org/configuration/devtool/#qualities). Some of the examples are:

1. Source code - the code before transpilation and bundling. Snapshot of the source code, splitted by modules
2. Transformed code - the code after transpilation by loaders (etc. babel-loader), splitted by modules
3. Generated code - the code after transpilation and bundling, splitted by modules. Every import and exported are replaced by webpack wrapper code

For development source maps for transformed or generated code is used as it is more performant and shows the exact code that is executed in the target environment. The main differences from the debugging without sourcemaps is that code has links to modules to original source files.

`tramvai` generates big single bundle with server code and that's why it is preferred to not include sourcemaps in the code itself and put it to the separate `.js.map` file.

##### Development

By default, for browser is used the fastest sourcemaps, while for server no sourcemaps is used.

Flag `--debug` enables sourcemap generation for the server bundle.

Option `commands.serve.configurations.sourceMap` enables sourcemap generation both for browser and server code.

##### Production

By default, sourcemaps are disabled both for the client and server code.

Flag `--debug` enables sourcemaps generation for the client and server bundles.

Option `commands.build.configurations.sourceMap` enables sourcemap generation for the client bundle.

Option `commands.build.configurations.sourceMapServer` enables sourcemap generation for the server bundle.

## How to

### Code generation

For make life easier for developers `@tramvai/cli` has ability to automatically generate code with template. For running code generator use command `tramvai generate` and pick up one of the options available to generate that entity:

- action
- bundle
- reducer
- page
- component
- module

After that template files will be generated

### Generate new project

For the quick start of new project you can use command `tramvai new` that will generate new base project with the tramvai and tramvai-cli

- install tramvai-cli [globally](#installation)
- enter command `tramvai new NAME_YOUR_APP` in the shell
- choose options based on your preferences: monorepo or multirepo, CI integration and testing framework

After command execution and dependency installation new project will be ready to use

### How to run nodejs app in debug mode?

Add flag `--debug` when running app

```sh
tramvai start my-app --debug
```

Then open chrome devTools, click on NodeJs logo in the upper left corner. New window with the nodejs devtools will be opened that allows to debug memory and cpu usage, debug code and take the performance profiles.

### Get details for deprecated and warning logs

It might be useful to get the stacktraces of some of the warnings.

E.g., while running app if you see logs like this

```
(node:2898) DeprecationWarning: ...
(Use `node --trace-deprecation ...` to show where the warning was created)
```

You may add flag `--trace` in order to run nodejs server with the [additional options](https://nodejs.org/dist/latest-v14.x/docs/api/cli.html#cli_trace_warnings).

```sh
tramvai start my-app --trace
```

After that these logs will be printed with their stacktraces

### How to use browserstack for testing

> To get access to browserstack just type command `/bs` in slack

Run app as usual with `tramvai start` command and follow the [browsertack instruction for the local development](https://www.browserstack.com/docs/live/local-testing). If everything were done right you will be able to get access to localhost inside browserstack and test your app through it.

### How to test app on mobile or other device in local network

Both devices one that running the app and one for testing must reside in the same network.

For setting access through local network follow next steps:

1. figure out the ip of the machine that runs app
2. run command `tramvai start` with flag `--staticHost` with value of the ip address that was resolved on previous step (e.g. `tramvai start tincoin --staticHost 192.168.1.3`)
3. from the testing device open the new page in the browser and use the ip address from the previous step as domain name

> When calling @tramvai/cli using npm you need to pass `--` before any additional arguments, e.g. command should look similar to this `npm start -- --staticHost 192.168.1.3`
