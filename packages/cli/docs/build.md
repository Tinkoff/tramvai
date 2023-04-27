---
sidebar_position: 4
---

## Library build

Command `tramvai build` can build libraries to separate bundles for various environments:

- CommonJS modules + ES2019 code (for nodejs without ESM support) - it uses field `main` in `package.json`
- ES modules + ES2019 code (for nodejs with ESM support) - it uses filed `module` in `package.json`
- ES modules + ES2019 code (for browsers) - it uses field `browser` in `package.json`

`@tramvai/cli` use [@tramvai/build](references/tools/build.md) package under the hood for bundling packages.

To specify new library in `tramvai.json` add new project with the type `package`:

```json
{
  "projects": {
    "{{packageName}}": {
      "name": "{{packageName}}",
      "type": "package",
      "root": "libs/{{packageName}}"
    }
  }
}
```

Library settings should be specified in the `package.json` of the library itself:

```json
{
  "name": "{{packageName}}",
  "version": "1.0.0",
  "main": "dist/index.js", // main library entry point
  "browser": "dist/browser.js", // optional field, library entry point for browsers bundle
  "typings": "src/index.ts", // 
  "sideEffects": false,
  "scripts": {
    "start": "tramvai build {{packageName}} --watchMode", // watch mode to develop package
    "build": "tramvai build {{packageName}} --forPublish --preserveModules" // single time build for the production
  }
}
```

See the complete documentation about output targets, configuration and many reciepes in [@tramvai/build documentation](references/tools/build.md).

## Enable sourcemaps in production mode

In `tramvai.json`

```json
"sourceMap": {
  "production": true
}
```

It is equivalent to `devtool: 'hidden-source-map'` in webpack config.
