# Tramvai test integration jest

Jest preset for integration-testing

> `@tramvai/cli` and `puppeteer` should be installed separately

## Installation

```bash
npm i --save-dev @tramvai/test-integration-jest
```

## How To

### Debug and development of integration tests in Jest

Using this jest preset you can run integration tests in watch mode. In this case, application itself will be launched only once and will work in background.

1. Add preset `@tramvai/test-integration-jest` to `jest.integration.config.js`:

   ```js
   module.exports = {
     preset: '@tramvai/test-integration-jest',
   };
   ```

2. Add new script for running tests in watch mode to `package.json`:

   ```json
   {
     "scripts": {
       "test:integration": "jest -w=3 --config ./jest.integration.config.js",
       "test:integration:watch": "jest --runInBand --watch --config ./jest.integration.config.js"
     }
   }
   ```

3. Run some test with `yarn test:integration:watch <path_to_test>`. In this case you are able to go to local url `http://localhost:3000` and see application at work.

### Environment for Jest

Minimal set of dependencies for running `jest`:

```bash
npm i --save-dev jest @types/jest jest-circus
```
