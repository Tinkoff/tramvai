import { resolve } from 'path';
import { initPuppeteer } from '@tramvai/test-puppeteer';
import { runRealApp } from '../startCliRealApp';
import type { StartCliResult } from '../startCli';

describe('test/integration/app/runFakeApp', () => {
  jest.setTimeout(60000);

  let app: StartCliResult;

  beforeAll(async () => {
    app = await runRealApp(
      resolve(__dirname, '../../../../../../../tinkoff-examples/bootstrap'),
      'bootstrap',
      {
        env: {
          FRONT_LOG_API: 'test',
        },
      }
    );
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('should return 200 status', async () => {
    return app.request('/').expect(200);
  });

  it('should work with papi', async () => {
    const { papi } = app;
    const response = await papi.publicPapi('bundleInfo').expect(200);

    expect(response.body).toMatchInlineSnapshot(`
      {
        "payload": [
          "/",
        ],
        "resultCode": "OK",
      }
    `);
  });

  it('should run app', async () => {
    const { application } = await app.render('/');
    expect(application).toMatchInlineSnapshot(`
      "
            <div class="layout__layout_yfynK">
              <div>
                <h1>Tramvai<span role="img" aria-label="dummy icon">🥳</span></h1>
              </div>
              <div>Main Page <button>click link</button></div>
              <div class="Footer__footer_a6x7v"><div>this Footer in bootstrap</div></div>
            </div>
          "
    `);
  });

  it('should work with puppeteer', async () => {
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();

    await page.goto(app.serverUrl);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai🥳
      Main Page click link
      this Footer in bootstrap"
    `);

    await browser.close();
  });
});
