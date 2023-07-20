import type { StartCliResult } from '@tramvai/test-integration';
import { sleep } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPlaywright } from '@tramvai/test-pw';
import path from 'path';
import fetch from 'node-fetch';

jest.setTimeout(30000);

const desktopModernUA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.3987.87 Safari/537.36';
const desktopDefaultUA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.3987.87 Safari/537.36';
const mobileModernUA =
  'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.3071.125 Mobile Safari/537.36';
const mobileDefaultUA =
  'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.3071.125 Mobile Safari/537.36';

describe('page-render-mode', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('page-render-mode', {
      rootDir: path.resolve(__dirname, '../'),
      env: {
        LOG_ENABLE: 'trace:static-pages',
      },
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
        "\${STATIC_URL}/dist/client/react.js",
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
        "\${STATIC_URL}/dist/client/react.js",
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
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();

    await page.goto(`${app.serverUrl}/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page to second page to static page
      this Footer in page-render-mode"
    `);

    await browser.close();
  });

  it('second page render full content after hydration', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

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

  it('page render mode can be changed by condition', async () => {
    let renderResult = await app.render('/auth-client/', {});

    // first render - ssr

    expect(renderResult.application).toMatchInlineSnapshot(`
      "
            <div>
              <h1>
                Tramvai
                <span role="img" aria-label="Salute">🥳</span>
              </h1>
            </div>
            <div>Auth Client Page <button type="button">to main page</button></div>
            <div class="Footer__footer_adktz"><div>this Footer in page-render-mode</div></div>
          "
    `);

    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();

    await page.goto(`${app.serverUrl}/auth-client/`);

    await sleep(500);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Auth Client Page to main page
      this Footer in page-render-mode"
    `);

    renderResult = await app.render('/auth-client/', {});

    // second render with cookie - csr

    await page.reload();

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Loading...
      this Footer in page-render-mode"
    `);

    await sleep(500);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Auth Client Page to main page
      this Footer in page-render-mode"
    `);

    await browser.close();
  });

  describe('static pages', () => {
    afterEach(() => {
      return fetch(`${app.serverUrl}/page-render-mode/private/papi/revalidate`, {
        method: 'POST',
      });
    });

    it('static page works', async () => {
      const { browser } = await initPlaywright(app.serverUrl);

      const page = await browser.newPage();

      await page.goto(`${app.serverUrl}/static/`);

      expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
        .toMatchInlineSnapshot(`
        "Tramvai 🥳
        Static Page to main page
        this Footer in page-render-mode"
      `);

      await browser.close();
    });

    it('cache pages by url, query are ignored', async () => {
      // @TODO: перейти на app.request('/static/') после мержа MR с переработкой papi
      const res1 = await fetch(`${app.serverUrl}/static/`, { headers: { cookie: 'foo=bar' } });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res2 = await fetch(`${app.serverUrl}/static/?a=1`, { headers: { cookie: 'foo=bar' } });
      const res3 = await fetch(`${app.serverUrl}/static/?b=2`, { headers: { cookie: 'foo=bar' } });
      const res4 = await fetch(`${app.serverUrl}/static-second/`, {
        headers: { cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res5 = await fetch(`${app.serverUrl}/static-second/?a=1`, {
        headers: { cookie: 'foo=bar' },
      });
      const res6 = await fetch(`${app.serverUrl}/static-second/?b=2`, {
        headers: { cookie: 'foo=bar' },
      });

      expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
      expect(res3.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
      expect(res4.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res5.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
      expect(res6.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
    });

    it('cache pages by host', async () => {
      const res1 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'x-original-host': 'foo.com', cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res2 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'x-original-host': 'foo.com', cookie: 'foo=bar' },
      });
      const res3 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'x-original-host': 'bar.com', cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res4 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'x-original-host': 'bar.com', cookie: 'foo=bar' },
      });

      expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
      expect(res3.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res4.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
    });

    it('cache pages by deviceType', async () => {
      const res1 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': desktopModernUA, cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res2 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': desktopModernUA, cookie: 'foo=bar' },
      });
      const res3 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': mobileModernUA, cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res4 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': mobileModernUA, cookie: 'foo=bar' },
      });

      expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
      expect(res3.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res4.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
    });

    it('cache pages by modern', async () => {
      const res1 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': desktopModernUA, cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res2 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': desktopModernUA, cookie: 'foo=bar' },
      });
      const res3 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': desktopDefaultUA, cookie: 'foo=bar' },
      });
      // time to background fetch unpersonalized page
      await sleep(150);
      const res4 = await fetch(`${app.serverUrl}/static/`, {
        headers: { 'User-Agent': desktopDefaultUA, cookie: 'foo=bar' },
      });

      expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
      expect(res3.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res4.headers.get('x-tramvai-static-page-from-cache')).toBe('true');
    });

    it('/papi/revalidate by path', async () => {
      const res1 = await fetch(`${app.serverUrl}/static/`);

      await fetch(`${app.serverUrl}/page-render-mode/private/papi/revalidate`, {
        method: 'POST',
        body: JSON.stringify({ path: 'static' }),
      });

      const res2 = await fetch(`${app.serverUrl}/static/`);

      expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
    });

    // eslint-disable-next-line jest/expect-expect
    it('Cache hit metrics', async () => {
      await fetch(`${app.serverUrl}/static/`);
      await fetch(`${app.serverUrl}/static/`);
      await fetch(`${app.serverUrl}/static/`);

      await app
        .request('/metrics')
        .expect(200, /# TYPE static_pages_cache_hit counter\nstatic_pages_cache_hit \d+/);
    });

    describe('5xx errors', () => {
      it('Fetched cache disabled', async () => {
        const res1 = await fetch(`${app.serverUrl}/static-error/`, {
          headers: { cookie: 'foo=bar' },
        });
        await sleep(150);
        const res2 = await fetch(`${app.serverUrl}/static-error/`, {
          headers: { cookie: 'foo=bar' },
        });

        expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
        expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      });

      it('Direct cache disabled', async () => {
        const res1 = await fetch(`${app.serverUrl}/static-error/`);
        await sleep(150);
        const res2 = await fetch(`${app.serverUrl}/static-error/`);

        expect(res1.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
        expect(res2.headers.get('x-tramvai-static-page-from-cache')).toBe(null);
      });
    });
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
