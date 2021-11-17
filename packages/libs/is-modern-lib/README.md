# @tinkoff/is-modern-lib

RegExp for check packages from node_modules that are distributed in ES2015+.

This RegExp might be used to determine modules which should be transpiled to ES5.

## Usage

Based on example from the article [Publish, ship, and install modern JavaScript](https://web.dev/publish-modern-javascript/#configure-babel-loader-to-transpile-node_modules)

```ts
// webpack.config.js
const { modernLibsFilter } = require('@tinkoff/is-modern-lib');

module.exports = {
  module: {
    rules: [
      // Transpile for your own first-party code:
      {
        test: /\.[cm]?js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // Transpile modern dependencies:
      {
        test: /\.[cm]?js$/i,
        include: modernLibsFilter,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```
