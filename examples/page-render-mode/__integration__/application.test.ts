import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPuppeteer } from '@tramvai/test-puppeteer';
import path from 'path';

jest.setTimeout(30000);

describe('page-render-mode', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('page-render-mode', {
      rootDir: path.resolve(__dirname, '../'),
    });
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('request to main page render fallback and load page js/css', async () => {
    const renderResult = await app.render('/', {});

    expect(getScripts(app, renderResult.parsed)).toMatchInlineSnapshot(`
      [
        "\${STATIC_URL}/dist/client/@_routes_index.chunk.js",
        "\${STATIC_URL}/dist/client/hmr.js",
        "\${STATIC_URL}/dist/client/platform.js",
      ]
    `);
    expect(getLinks(app, renderResult.parsed)).toMatchInlineSnapshot(`
      [
        "\${STATIC_URL}/dist/client/@_routes_index.chunk.css",
        "\${STATIC_URL}/dist/client/platform.css",
      ]
    `);

    expect(renderResult.application).toMatchInlineSnapshot(`
      "
            <div>
              <h1>
                Tramvai
                <span role="img" aria-label="Salute">🥳</span>
              </h1>
            </div>
            <div>Main Page loading...</div>
            <div class="Footer__footer_adktz"><div>this Footer in page-render-mode</div></div>
          "
    `);
  });

  it('request to second page render fallback and load page js/css', async () => {
    const renderResult = await app.render('/second/', {});

    expect(getScripts(app, renderResult.parsed)).toMatchInlineSnapshot(`
      [
        "\${STATIC_URL}/dist/client/@_routes_second_index.chunk.js",
        "\${STATIC_URL}/dist/client/hmr.js",
        "\${STATIC_URL}/dist/client/platform.js",
      ]
    `);
    expect(getLinks(app, renderResult.parsed)).toMatchInlineSnapshot(`
      [
        "\${STATIC_URL}/dist/client/platform.css",
      ]
    `);

    expect(renderResult.application).toMatchInlineSnapshot(`
      "
            <div>
              <h1>
                Tramvai
                <span role="img" aria-label="Salute">🥳</span>
              </h1>
            </div>
            <div>Loading...</div>
            <div class="Footer__footer_adktz"><div>this Footer in page-render-mode</div></div>
          "
    `);
  });

  it('main page render full content after hydration', async () => {
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();

    await page.goto(`${app.serverUrl}/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page to second page
      this Footer in page-render-mode"
    `);

    await browser.close();
  });

  it('second page render full content after hydration', async () => {
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();

    await page.goto(`${app.serverUrl}/second/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Second Page to main page
      this Footer in page-render-mode"
    `);

    await browser.close();
  });
});

function getScripts(app: any, parsed: any) {
  return parsed
    .querySelectorAll('script')
    .map((script: any) => {
      return script.attributes.src || script.attributes['data-src'];
    })
    .filter(Boolean);
}

function getLinks(app: any, parsed: any) {
  return parsed
    .querySelectorAll('link')
    .map((link: any) => {
      return link.attributes.href || link.attributes['data-href'];
    })
    .filter(Boolean);
}
