import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPlaywright } from '@tramvai/test-pw';
import path from 'path';

jest.setTimeout(30000);

describe('react-18-integration', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('react-18-integration', {
      rootDir: path.resolve(__dirname, '../'),
    });
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('main page render full content after hydration', async () => {
    const { browser } = await initPlaywright(app.serverUrl);

    const page = await browser.newPage();

    await page.goto(`${app.serverUrl}/`);

    expect(await page.$eval('.application', (node) => (node as HTMLElement).innerText))
      .toMatchInlineSnapshot(`
      "Tramvai 🥳
      Main Page with React 18
      this Footer in react-18-integration"
    `);

    await browser.close();
  });
});
