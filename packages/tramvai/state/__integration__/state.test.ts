import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('tramvai-state', () => {
  const { getApp } = testApp({
    name: 'state',
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('should automatically register reducer', async () => {
    const { render } = getApp();
    const { parsed } = await render('/');

    expect(parsed.querySelector('#registered')?.innerText).toEqual('registered');
  });

  it('should batch updates to different stores', async () => {
    const { page } = await getPageWrapper('/');

    expect(await page.evaluate(() => document.getElementById('content')?.innerText)).toEqual('0');

    await page.evaluate(() => document.getElementById('button')?.click());

    await page.waitForSelector('#updated', { timeout: 1000 });

    expect(await page.evaluate(() => document.getElementById('content')?.innerText)).toEqual('1');
  });
});
