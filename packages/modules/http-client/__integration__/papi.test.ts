import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('HttpClientModule, papi', () => {
  const { getApp } = testApp({
    name: 'http-client',
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('PapiService work at server and browser', async () => {
    const app = getApp();
    const { serverUrl } = getApp();
    const { page } = await getPageWrapper();

    const parsed = await app.render('/http-client-papi/');

    expect(parsed.parsed.querySelector('#test-papi-state-0').innerText).toMatchInlineSnapshot(
      `"async-papi-server"`
    );
    expect(parsed.parsed.querySelector('#test-papi-state-1').innerText).toMatchInlineSnapshot(
      `"sync-papi-server"`
    );

    await page.goto(`${serverUrl}/http-client-papi/`, {
      waitUntil: 'networkidle0',
    });

    expect(
      await page.$eval('#test-papi-state-0', (node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"async-papi-browser"`);
    expect(
      await page.$eval('#test-papi-state-1', (node) => (node as HTMLElement).innerText)
    ).toMatchInlineSnapshot(`"sync-papi-browser"`);
  });
});
