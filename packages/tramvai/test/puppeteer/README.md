# Tramvai test puppeteer

Библиотека хелперов для работы с [puppeteer](https://github.com/puppeteer/puppeteer) в интеграционных тестах

> Для работы должен быть установлен отдельно `puppeteer`

## Подключение

```bash
npm i --save-dev @tramvai/test-puppeteer
```

## How To

### Тестирование приложения в браузере с помощью `Puppeteer`

`Puppeteer` запускает тесты в headless Chrome браузере, документация доступна на [официальном сайте](https://pptr.dev/)

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
  const browser = await initPuppeteer(app.serverUrl);

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
