# @tramvai/tools-public-packages

## Explanation

This package contains a list of libraries that are available for open source publication and utilities for preparing these libraries for open source.

List of utilities:

- `tools/public-packages/update-public-packages-versions.js'

    it is expected that the `packages-versions.json` file with the latest current versions of packages will be available in the public code, and the script will be able to replace `0.0.0-stub` versions with the real ones, before publishing packages to `npm`.