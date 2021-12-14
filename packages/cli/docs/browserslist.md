# @tramvai/cli integration with browserslist

[browserslist](https://github.com/browserslist/browserslist) is used for targeting specific browsers for the build. It allows to make only necessary transformations of the source code and to provide most modern code to the end browsers.

Where browserslist is used:

- For building js/ts code - with [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
- For build css - with postcss-plugin [autoprefixer](https://github.com/postcss/autoprefixer)

## Supported envs for browserslist

In cli only specific list of supported env targets is used for browserslist:

- `modern` - used for builds supposed to be provided for modern browsers
- `node` - used for builds running on server
- `defaults` - used otherwise, usually for outdated browsers

## cli setup

By default, cli uses browserslist config from a library `@tinkoff/browserslist-config`.

To extend or override default settings, you can use any of the methods [for browserslist config](https://github.com/browserslist/browserslist#queries) following next rules:

- It is allowed to change config only for [envs from the list used in cli](#supported-envs-for-browserslist). How to do it see [browserslist docs](https://github.com/browserslist/browserslist#configuring-for-different-environments). If some of env is not defined, the default config for the env will be used.
- If you want to extend default settings then use [the ability to extend config](https://github.com/browserslist/browserslist#shareable-configs)
  ```json
  "browserslist": {
    "modern": [
      "extends @tinkoff/browserslist-config",
      "chrome > 25"
    ],
    "node": [
      "extends @tinkoff/browserslist-config"
    ],
    "defaults": [
      "extends @tinkoff/browserslist-config",
      "chrome > 27"
    ]
  }
  ```
- If you want to narrow down the supported list of the browsers, then do not use `extends @tinkoff/browserslist-config` and specify list of the supported browsers yourself. Take the default list from the `@tinkoff/browserslist-config` as a basis. Do it for every [env](#supported-envs-for-browserslist) if you need it. Not overrided env will use default settings.

## Debug

You can test how browserslist works using next commands:

```sh
npx browserslist --env=modern # list of the modern browsers
npx browserslist --env=node # list of the supported nodejs versions
npx browserslist # list of the browsers including legacy one
```

## Caveats

### autoprefixer

Because of the some internal restrictions of the `autoprefixer` build will be executed only using `defaults` config. If you really interested in this feature, please, create an issue on the github.
