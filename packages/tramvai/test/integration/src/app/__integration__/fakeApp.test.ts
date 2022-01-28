import { initPuppeteer, wrapPuppeteerPage } from '@tramvai/test-puppeteer';
import { runFakeApp } from '../startCliFakeApp';
import type { StartCliResult } from '../startCli';

describe('test/integration/app/runFakeApp', () => {
  jest.setTimeout(10000);

  let app: StartCliResult;

  beforeAll(async () => {
    app = await runFakeApp({
      root: __dirname,
    });
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('should return 200 status', async () => {
    return app.request('/').expect(200);
  });

  it('should run app', async () => {
    const { application } = await app.render('/');
    expect(application).toMatchInlineSnapshot(`"fake app"`);
  });

  it('should work with puppeteer', async () => {
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();

    const wrapper = wrapPuppeteerPage(page);

    await page.goto(app.serverUrl);

    expect(
      await page.$eval('.application', (node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"fake app"`);

    await wrapper.router.navigateThenWaitForReload('./second');

    expect(
      await page.$eval('.application', (node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"second page"`);

    await browser.close();
  });

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
});
