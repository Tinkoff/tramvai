---
sidebar_position: 3
---

> Command to start development build in watch mode

## Options

### `-p`, `--port`

Allows to specify port on which app server will listen requests

```sh
tramvai start -p 8080 <app>
```

## React hot refresh

It is possible to refresh react components without page similar to the way in works in [React Native](https://reactnative.dev/docs/fast-refresh).

Besides fash page refreshes (hot-reload) in that mode state is preserved for hooks `useState` and `useRef`.

> You can force resetting state by adding comment `// @refresh reset` to the file. It will reset state for the whole file.

When encounter syntax and runtime errors, fast-refresh plugin will await for the error resolving and after fix will continue to work as usual.

Constraints:

1. state for class components doesn't preserve
2. `useEffect`, `useMemo`, `useCallback` refresh on every code change despite their dependency list, it includes empty dependency list as well, e.g. `useEffect(() => {}, [])` will be executed on every refresh - this is undesirable behaviour but it teaches to write stable code which is resistant for the redundant renders

To enable this mode, add to `tramvai.json`:

```json
"commands": {
    "serve": {
      "configurations": {
        "hotRefresh": true
      }
    }
}
```

You can configure settings with `hotRefreshOptions` option, see details [in the docs of react-refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin#options):

```json
"commands": {
    "serve": {
      "configurations": {
        "hotRefresh": true,
        "hotRefreshOptions": {
          "overlay": false // disable error overlay
        }
      }
    }
}
```

## Enable sourcemaps in dev mode

In `tramvai.json`

```json
"commands": {
    "serve": {
      "configurations": {
        "sourceMap": true
      }
    }
}
```

## modern build and dev-mode

In dev-mode may work only single build mode: either `modern` or `legacy`. By default `legacy` is used. If you want to use modern build in dev mode, add next lines to the `tramvai.json`:

```json
"commands": {
    "serve": {
      "configurations": {
        "modern": true
      }
    }
}
```

## How to

### Speed up development build

#### Build only specific bundles

App may contain of many bundles and the more there bundle, the more code get bundled to the app, the more long in building and rebuilding the app during development.

In order to speed up that process when running `@tramvai/cli` it is possible to specify bundles required for the development and cli will build only that bundles.

> Bundles should be placed in directory `bundles` and should be imported from the index app file.

> When trying to request bundle that was disabled, server will fail with status 500, as it is unexpected condition for the server that bundle is missing

```sh
# if you need only single bundle during development
tramvai start myapp --onlyBundles=account
# if you need several bundles
tramvai start myapp --onlyBundle=account,trading
```
