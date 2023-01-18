import path from 'path';
import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';
import { initPlaywright } from '@tramvai/test-pw';

jest.setTimeout(30000);

describe('assets', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('assets', {
      rootDir: path.resolve(__dirname, '../'),
    });
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('server HTML snapshot', async () => {
    const { application } = await app.render('/');

    expect(application).toMatchSnapshot();
  });

  it('client HTML snapshot', async () => {
    const { browser, getPageWrapper } = await initPlaywright(app.serverUrl);
    const { page } = await getPageWrapper(app.serverUrl);

    expect(
      await page
        .$eval('.application', (node) => (node as HTMLElement).innerHTML)
        .then((html) => html.replace(app.staticUrl, '{STATIC_URL}'))
    ).toMatchSnapshot();

    await browser.close();
  });
});
