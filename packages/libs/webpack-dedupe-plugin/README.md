# @tramvai/webpack-dedupe-plugin

Module deduplication plugin for webpack.

Internally webpack treats modules from different directories as completely different modules, and in result bundle there will be all these modules as separate entries which leads to duplication and bundle size increase. This module allows to leave only one of these modules based on chosen strategy.

### Usage

```js
// webpack.config.js
const { createDedupePlugin } = require('@tinkoff/webpack-dedupe-plugin')

module.exports = {
  ...
  plugins: [
    createDedupePlugin(dedupeStrategy, ignoreDedupe)
  ]
}

```

#### dedupeStrategy

- `"equality"` - uses strict version comparison. Dedupes modules in `node_modules` with equal package version that are imported from different sources. E.g. imports for `node_modules/package/index.js` and `node_modules/nested-package/node_modules/package/index.js` are deduped into a single `node_modules/package/index.js` import whilst without dedupe it will bundle two files as separate modules.
- `"semver"` - compares version of packages based on semver. It can dedupe all of the imports with the same major version and any of the minor and patch versions. E.g. next versions will be deduped: from `1.14.0` and `1.16.2` to `1.16.2`, from `0.14.1` and `0.16.5` to `0.16.5`, whilst versions `0.0.2` and `0.0.5` will be left without deduplication.
- `false` - disable deduplication, by default

#### ignoreDedupe

List of regular expressions that specify which modules should not be deduplicated.
