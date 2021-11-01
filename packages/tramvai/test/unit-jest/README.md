# Tramvai test unit jest

Jest preset for unit-testing

## Installation

Install package:

```bash
npm i --save-dev @tramvai/test-unit-jest
```

Add new preset to your jest.config:

```js
module.exports = {
  preset: '@tramvai/test-unit-jest',
};
```

## Explanation

This presets implements next settings:

- use jest-circus as testRunner
- default testEnvironment is `node`
- uses `babel-jest` for transformation
- css files are mapped with [`identity-obj-proxy`](https://www.npmjs.com/package/identity-obj-proxy)
- image files are mapped to empty string

## How To

### Override testEnvironment for file

Based on [jest doc](https://jestjs.io/docs/configuration#testenvironment-string)

Just add at the start of test file following comment:

```ts
/**
 * @jest-environment your-environment
 */
```
