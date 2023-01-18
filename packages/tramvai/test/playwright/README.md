# Tramvai test Playwright

Set of helpers for using [playwright](https://playwright.dev) in the integration tests

> `Playwright` should be installed separately

## Installation

```bash
npm i --save-dev @tramvai/test-pw
```

## How To

### Tests in browser

`Playwright` runs tests in headless Chrome browser, documentation can be found on [official site](https://pptr.dev/)

```ts
import { startCli } from '@tramvai/test-integration';
import { initPlaywright, wrapPlaywrightPage } from '@tramvai/test-pw';

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

it('Playwright', async () => {
  const { browser } = await initPlaywright(app.serverUrl);

  const page = await browser.newPage();
  const wrapper = wrapPlaywrightPage(page);

  await page.goto(app.serverUrl);

  expect(
    await page.$eval('.application', (node) => (node as HTMLElement).innerText)
  ).toMatchInlineSnapshot(`"Main Page click link"`);

  await wrapper.router.navigate('./second');

  expect(
    await page.$eval('.application', (node) => (node as HTMLElement).innerText)
  ).toMatchInlineSnapshot(`"Second Page click link"`);

  await browser.close();
});
```
