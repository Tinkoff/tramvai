# Minicss class name generator

`css-loader` plugin which generates short css class names. Details in the [article](https://dev.to/denisx/reduce-bundle-size-via-one-letter-css-classname-hash-strategy-10g6)

## Installation

Install using yarn

```bash
yarn add --dev @tinkoff/minicss-class-generator
```

or npm

```bash
npm i --save-dev @tinkoff/minicss-class-generator
```

## Setup

Define options `localIdentName` и `getLocalIdent` for `css-loader` config inside your webpack config:

```js
({
  loader: 'css-loader',
  options: {
    modules: {
      getLocalIdent: createGenerator(),
      localIdentName: '[minicss]',
    },
  },
});
```

For `localIdentName` it is possible to pass any template which is accepted by css-loader. E.g. if you want to add the origin filename and the className pass `[name]__[local]_[minicss]` as `localIdentName`

## How does it work

Plugin generate unique key for a className using formula `${order}${contentHash}` where `contentHash` is a hash of the source file content and `order` - ordered key of class definition inside source file. Using `contentHash` from source allows to generate less unique string and allows to reuse the same `contentHash` for every className that leads for better data compression with gzip/brotli. Using `order` helps sustain uniqueness for every className in single source file.

Examples:

```
[hash:base64:5]
file: Button.css
 .2hlLi
 .32BZU
```

```
[minicss]
file: Button.css
 .abhUzy
 .bbhUzy
```
