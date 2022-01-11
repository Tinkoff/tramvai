## Library build

Command `tramvai build` can build libraries to separate bundles for various environments:

- CommonJS modules + ES2015 code (for nodejs without ESM support) - it uses field `main` in `package.json`
- ES modules + ES2015 code (for nodejs with ESM support) - it uses filed `module` in `package.json`
- ES modules + ES5 code (for legacy browser) - it uses field `browser` in `package.json`
- ES modules + ES2017+ code (for modern browsers) - it uses field `es2017` in `package.json`

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

Any additional settings should be specified in the `package.json` of the library itself:

```json
{
  "name": "{{packageName}}",
  "version": "1.0.0",
  "source": "src/index.ts", // entry point to library
  "browserSource": "src/browser.ts", // optional field, entry point for the browser environment. Can be used to split implementations for server and browser
  "main": "dist/index.js", // name of the built CommonJS + ES2015 bundle
  "module": "dist/index.es.js", // name of the built ESM + ES2015 bundle
  "browser": "dist/browser.js", // optional field, name of the built + ES2015 bundle, should be used with the field `browserSource`
  "es2017": "dist/browser.es2017.js", // optional field, name of the built ESM + ES2017 bundle. It it is omitted calculates from the `source` field
  "sideEffects": false,
  "scripts": {
    "start": "tramvai build {{packageName}} --watch", // watch mode to develop package
    "build": "tramvai build {{packageName}}" // single time build for the production
  }
}
```
