import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';

describe('router/link-prefetch', () => {
  const { getApp } = testApp({
    name: 'link-prefetch',
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('fetch assets for Link components target urls', async () => {
    const { staticUrl } = getApp();
    const { page } = await getPageWrapper();
    const assetsRequests: string[] = [];

    const initialChunks = [
      `${staticUrl}/dist/client/mainDefault.chunk.js`,
      `${staticUrl}/dist/client/pages-main.chunk.js`,
      `${staticUrl}/dist/client/platform.js`,
    ];
    const inViewportChunks = [
      `${staticUrl}/dist/client/pages-third.chunk.js`,
      `${staticUrl}/dist/client/pages-second.chunk.css`,
      `${staticUrl}/dist/client/pages-second.chunk.js`,
    ];
    const outOfViewportChunks = [`${staticUrl}/dist/client/pages-out-of-viewport.chunk.js`];

    page.setRequestInterception(true);

    page.on('request', (request) => {
      if (request.url().startsWith(staticUrl)) {
        assetsRequests.push(request.url());
      }

      request.continue();
    });

    await page.goto(`${getApp().serverUrl}/`);

    expect(assetsRequests).toStrictEqual([...initialChunks]);

    await sleep(100);

    expect(assetsRequests.sort()).toStrictEqual([...initialChunks, ...inViewportChunks].sort());

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await sleep(100);

    expect(assetsRequests.sort()).toStrictEqual(
      [...initialChunks, ...inViewportChunks, ...outOfViewportChunks].sort()
    );
  });
});
