# @tinkoff/is-modern-lib

RegExp для поиска библиотек из node_modules, написанных на ES2015+.
Этот список требуется для определения модулей для транспиляции в ES5.

## Использование

Пример на основе кода из статьи [Publish, ship, and install modern JavaScript](https://web.dev/publish-modern-javascript/#configure-babel-loader-to-transpile-node_modules)

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
