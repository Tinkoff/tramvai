---
title: Duplicate dependencies
---

Duplicated dependencies are a common problem for JavaScript projects that use npm or yarn to manage packages. They occur when two or more versions of the same package appears in dependencies tree due the way package managers create `node_modules` folder on the disk.

## Why is it a problem?

Duplicated dependencies can cause several issues for your project, such as:

- Increasing the size of your bundles and slowing down your page loading time
- Increasing time of installing and updating dependencies locally and in CI
- Causing conflicts and errors when different versions of the same package are used in different parts of your code
- Breaking the rules of hooks if you have more than one copy of singleton library (like React) in your app
- Making it harder to maintain and update your dependencies

## How to solve

### Tramvai DedupePlugin for webpack

_Plugin is enabled by default when using @tramvai/cli_

[webpack-dedupe-plugin](references/libs/webpack-dedupe-plugin.md) can automatically resolve most of the duplicate dependencies issues that are related to generated bundle. And you can even try different strategies of this plugin to generate even smaller bundles.

After build when plugin is enabled it will show the info about packages that were deduplicated.

### Using package manager

#### npm

To investigate if specific dependency is duplicated and why, use next command:

```sh
npm ls <dep_name>
```

To execute deduplication of dependencies tree run next command in the root of your project (where package-lock.json file resides):


:::caution

This command can run for a really long time (more than 20 minutes)

:::

```sh
npm dedupe
```

#### yarn v1

To investigate if specific dependency is duplicated and why, use next command:

```sh
yarn why <dep_name>
```

To deduplicate the whole dependecies tree use separate tool [yarn-deduplicate](https://www.npmjs.com/search?q=yarn-deduplicate) in the root of your project (where yarn.lock file resides)

```sh
npx yarn-deduplicate
```
