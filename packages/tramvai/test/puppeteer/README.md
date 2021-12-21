# Tramvai test puppeteer

Set of helpers for using [puppeteer](https://github.com/puppeteer/puppeteer) in the integration tests

> `puppeter` should be installed separately

## Installation

```bash
npm i --save-dev @tramvai/test-puppeteer
```

## How To

### Tests in browser

`Puppeteer` runs tests in headless Chrome browser, documentation can be found on [official site](https://pptr.dev/)

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

it('puppeteer', async () => {
  const { browser } = await initPuppeteer(app.serverUrl);

  const page = await browser.newPage();
  const wrapper = wrapPuppeteerPage(page);

  await page.goto(app.serverUrl);

  expect(
    await page.$eval('.application', (node) => (node as HTMLElement).innerText)
  ).toMatchInlineSnapshot(`"Main Page click link"`);

  await wrapper.router.navigateWithReload('./second');

  expect(
    await page.$eval('.application', (node) => (node as HTMLElement).innerText)
  ).toMatchInlineSnapshot(`"Second Page click link"`);

  await browser.close();
});
```
