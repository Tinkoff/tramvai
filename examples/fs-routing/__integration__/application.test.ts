import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPlaywright, wrapPlaywrightPage } from '@tramvai/test-pw';
import path from 'path';

jest.setTimeout(30000);

describe('fs-routing', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('fs-routing', {
      rootDir: path.resolve(__dirname, '../'),
    });
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('request to main page return status 200', async () => {
    return app.request('/').expect(200);
  });

  it('request to second page return status 200', async () => {
    return app.request('/second/').expect(200);
  });

  it('request to old page return status 200', async () => {
    return app.request('/old/').expect(200);
  });

  it('request to third page return status 200', async () => {
    return app.request('/third/').expect(200);
  });

  it('request to page with dynamic params return status 200', async () => {
    return app.request('/123/test/456/').expect(200);
  });

  it('request to fourth page return status 500', async () => {
    return app.request('/fourth/').expect(500);
  });

  it('file-system pages server actions', async () => {
    const { initialState } = await app.render('/');
    const actionsServerState = initialState.stores.actionTramvai.serverState;

    expect(actionsServerState['bundle-server-action'].status).toBe('success');
  });

  // @todo: how to test client actions?

  it('SPA transition from file-system page to file-system page', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();
    const wrapper = wrapPlaywrightPage(page);

    await page.goto(app.serverUrl);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page Nested Layout
      Main Pageto second pageto old pageto error page
      this Footer in fs-routing

      This is modal for index page!"
    `);

    await wrapper.router.navigate('./second');

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Current route is /second/ to main pageto old page
      this Footer in fs-routing

      This is modal for second page!"
    `);

    await browser.close();
  });

  it('SPA transition from usual page to file-system page', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();
    const wrapper = wrapPlaywrightPage(page);

    await page.goto(`${app.serverUrl}/old/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Current route is /old/ to main pageto second page
      this Footer in fs-routing

      This is modal for index page!"
    `);

    await wrapper.router.navigate('./');

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Current route is /old/ to main pageto second page
      this Footer in fs-routing

      This is modal for index page!"
    `);

    await browser.close();
  });

  it('SPA transition from file-system page to usual page', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();
    const wrapper = wrapPlaywrightPage(page);

    await page.goto(app.serverUrl);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page Nested Layout
      Main Pageto second pageto old pageto error page
      this Footer in fs-routing

      This is modal for index page!"
    `);

    await wrapper.router.navigate('./old');

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Current route is /old/ to main pageto second page
      this Footer in fs-routing

      This is modal for index page!"
    `);

    await browser.close();
  });

  it('page component seo property applied', async () => {
    const parsed = await app.render('/');

    expect(parsed.parsed.querySelector('title').innerText).toBe('Main Page Title');
  });

  it('if a render error occurs, page must fallback to the error boundary for that page', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();
    await page.goto(`${app.serverUrl}/third/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      There will be an error when you will click on the button 🤓break a leg!to main page
      this Footer in fs-routing"
    `);

    await page.click('#break-button');

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      An error occurred during render route /third/!

      Current url: /third/

      Error: Cannot read properties of undefined (reading 'azaza')

      this Footer in fs-routing"
    `);

    await browser.close();
  });

  it('if an error occurs during server rendering, page must fallback to the error boundary for that page', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();
    await page.goto(`${app.serverUrl}/fourth/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      An error occurred during render route /fourth/!

      Current url: /fourth/

      Error: Cannot read properties of undefined (reading 'azaza')

      this Footer in fs-routing"
    `);

    await browser.close();
  });
});
