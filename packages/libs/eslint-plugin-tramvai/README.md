# eslint-plugin-tramvai

Set of `eslint` rules specific to `tramvai` apps. Should be used primarily as an extension to `@tinkoff/eslint-config`

## Installation

Install necessary packages first

```bash
npm i --save-dev @tinkoff/eslint-config @tinkoff/eslint-config-react @tinkoff/eslint-plugin-tramvai
```

Add recommended settings to `.eslintrc`:

```bash
{
  "extends": [
    "@tinkoff/eslint-config/app",
    "@tinkoff/eslint-config-react",
    "plugin:@tinkoff/tramvai/recommended"
  ]
}
```

Or add plugin manually:

```bash
{
  "extends": [
    "@tinkoff/eslint-config/app",
    "@tinkoff/eslint-config-react"
  ],
  "plugins": [
    "@tinkoff/tramvai"
  ],
  "rules": {
    "@tinkoff/tramvai/bundle-chunk-name": "warn"
  }
}
```

## Rules

### bundle-chunk-name

In a tramvai app, in order to work properly with the bundle system it is necessary to put a [special comment for dynamic imports](https://tramvai.dev/docs/modules/render#%D0%BE%D1%81%D0%BE%D0%B1%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8). This rule checks that dynamic imports of bundles are marked with a proper control comment `webpackChunkName: [name]`.

The rule also provides autofix in order to add add/fix control comment automatically.

Example of the wrong code:

```typescript
createApp({
  bundles: {
    'tramvai/bundle-1': () => import('./bundles/bundle1'),
    'tramvai/bundle-2': () => import(/* webpackChunkName: "randomValue" */ './bundles/bundle2'),
  },
});
```

Example of the right code after autofix for the code above:

```typescript
createApp({
  bundles: {
    'tramvai/bundle-1': () => import(/* webpackChunkName: "bundle-1" */ './bundles/bundle1'),
    'tramvai/bundle-2': () => import(/* webpackChunkName: "bundle-2" */ './bundles/bundle2'),
  },
});
```

Options:

- `propertyNames`: defines array of object properties which will be analyzed. By default it equals to `["bundles"]`.
