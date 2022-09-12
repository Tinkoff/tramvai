import { resolve } from 'path';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('ssr-async-components', () => {
  const { getApp } = testApp({
    target: 'ssr-async-components',
    cwd: resolve(__dirname, '..', '..'),
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('ssr render', async () => {
    const { staticUrl, render } = await getApp();

    const { head } = await render('/');

    expect(head).toEqual(`
<meta charset="UTF-8">



<script></script>


<link data-critical="true" onload="__preloadJS()" rel="stylesheet" href="${staticUrl}/dist/client/pages-page.chunk.css">
<link data-critical="true" onload="__preloadJS()" rel="stylesheet" href="${staticUrl}/dist/client/InnerPageInitial.chunk.css">






<script defer="defer" charset="utf-8" crossorigin="anonymous" data-critical="true" src="${staticUrl}/dist/client/pages-page.chunk.js"></script>
<script defer="defer" charset="utf-8" crossorigin="anonymous" data-critical="true" src="${staticUrl}/dist/client/InnerPageInitial.chunk.js"></script>
<script defer="defer" charset="utf-8" crossorigin="anonymous" data-critical="true" src="${staticUrl}/dist/client/platform.js"></script>





`);
  });

  it('should render components on render', async () => {
    const { page } = await getPageWrapper('/');
    const rootTest = await page.$('#root-test');
    const innerOnClick = await page.$('#inner-page-initial');

    expect(rootTest).toBeDefined();
    expect(
      await rootTest.evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return { color: styles.color, textAlign: styles.textAlign };
      })
    ).toEqual({
      color: 'rgb(0, 0, 0)',
      textAlign: 'left',
    });

    expect(innerOnClick).toBeDefined();
    expect(
      await innerOnClick.evaluate((element) => {
        const styles = window.getComputedStyle(element.querySelector('h3'));
        return { color: styles.color, textAlign: styles.textAlign };
      })
    ).toEqual({
      color: 'rgb(0, 0, 255)',
      textAlign: 'center',
    });
  });

  it('should load new component', async () => {
    const { page } = await getPageWrapper('/');
    const showButton = await page.$('#root-button-show');

    await showButton.click();

    await page.waitForSelector('#inner-page-onclick');

    const innerElement = await page.$('#inner-page-onclick');

    expect(innerElement).toBeDefined();
    expect(
      await innerElement.evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return { color: styles.color, textAlign: styles.textAlign };
      })
    ).toEqual({
      color: 'rgb(255, 0, 0)',
      textAlign: 'right',
    });
  });
});
