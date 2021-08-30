import { runFakeApp } from '../startCliFakeApp';
import type { ThenArg } from '../types';
import { initPuppeteer, wrapPuppeteerPage } from '../../../../legacy/puppeteer';

describe('test/integration/app/runFakeApp', () => {
  jest.setTimeout(10000);

  let app: ThenArg<ReturnType<typeof runFakeApp>>;

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

    await page.goto(app.serverUrl);

    const wrapper = wrapPuppeteerPage(page);

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
