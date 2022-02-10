# Tramvai test integration

Set of helpers to simplify the process of writing integration tests for the tramvai app. Implies full-fledged run of the app with build made by `@tramvai/cli` and use of helpers for test result of requests to the server and test render of the app in the browser.

> The `@tramvai/cli` package is required and should be installed manually

## Installation

```bash
npm i --save-dev @tramvai/test-integration
```

## How To

### Test request to the tramvai app without using browser (aka `curl`)

For testing requests to the tramvai app libraries [superagent](https://github.com/visionmedia/superagent) and [node-html-parser](https://github.com/taoqf/node-html-parser) are used under hood.

Call of `app.request` sends requests to the app. All of the features of `superagent` are available.

Call of `app.render` resolves to the HTML render that is returned from server while serving the request.

```ts
import { startCli } from '@tramvai/test-integration';
import { initPuppeteer, wrapPuppeteerPage } from '@tramvai/test-puppeteer';

beforeAll(async () => {
  app = await startCli('bootstrap', {
    env: {
      SOME_ENV: 'test',
    },
  });
}, 80000);

afterAll(() => {
  return app.close();
});

it('request to main page should return status 200', async () => {
  return app.request('/').expect(200);
});

it('main page HTML snapshot', async () => {
  const parsed = await app.render('/');
  const applicationInnerHtml = parsed.application;

  expect(parsed.application).toMatchInlineSnapshot();
});
```

### Testing app in browser with the `puppeteer`

You may use another library [@tramvai/test-puppeteer](references/tramvai/test/puppeteer.md) to implement testing in the browser.

### Usage of `@tinkoff/mocker` in tests

In order to use mocker there should be added [`@tramvai/module-mocker`](references/modules/mocker.md) to the tramvai app modules list.

After thar mocker will read file based mocks as it described in the docs to the mocker itself and it can be used dynamically in the tests:

```ts
it('should work with mocker', async () => {
  await app.mocker.addMocks('CONFIG_API', {
    'GET /test/': {
      status: 200,
      payload: {
        status: 'OK',
        response: 'smth',
      },
    },
  });

  await app.request('/api/').expect(200);

  await app.papi.clearCache();
  await app.mocker.removeMocks('CONFIG_API', ['GET /test/']);

  await app.request('/api/').expect(500);
});
```
