import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPuppeteer, wrapPuppeteerPage } from '@tramvai/test-puppeteer';
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

  it('file-system pages server actions', async () => {
    const { initialState } = await app.render('/');
    const actionsServerState = initialState.stores.actionTramvai.serverState;

    expect(actionsServerState['bundle-server-action'].status).toBe('success');
  });

  // @todo: how to test client actions?

  it('SPA transition from file-system page to file-system page', async () => {
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();
    const wrapper = wrapPuppeteerPage(page);

    await page.goto(app.serverUrl);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page to second pageto old page
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
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();
    const wrapper = wrapPuppeteerPage(page);

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
    const { browser } = await initPuppeteer(app.serverUrl);

    const page = await browser.newPage();
    const wrapper = wrapPuppeteerPage(page);

    await page.goto(app.serverUrl);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page to second pageto old page
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
});
