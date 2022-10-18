import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPuppeteer } from '@tramvai/test-puppeteer';
import path from 'path';

jest.setTimeout(30000);

describe('render-to-stream', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('render-to-stream', {
      rootDir: path.resolve(__dirname, '../'),
    });
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('request to main page return status 200', async () => {
    return app.request('/').expect(200);
  });

  it('server render', async () => {
    const { parsed } = await app.render('/');

    expect(parsed.querySelector('.application')?.innerText).toMatchInlineSnapshot(`
      "
            
              
                Tramvai
                🥳
              
            
            
              Main Page to second page
              Child Component
              Error fallback
            
            
              this Footer in render-to-stream
              This is modal for index page!
            
          "
    `);
  });

  it('client hydration', async () => {
    const { browser, getPageWrapper } = await initPuppeteer(app.serverUrl);

    const { page } = await getPageWrapper(app.serverUrl);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page to second page
      Child Component
      Error boundary
      this Footer in render-to-stream

      This is modal for index page!"
    `);

    await browser.close();
  });
});
