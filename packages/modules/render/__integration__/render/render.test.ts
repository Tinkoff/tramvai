import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('render', () => {
  const { getApp } = testApp({
    name: 'render',
    config: {
      polyfill: 'polyfill.ts',
    },
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('should add html attributes', async () => {
    const { parsed } = await getApp().render('/');

    const htmlAttrs = parsed.querySelector('html').attributes;
    const bodyAttrs = parsed.querySelector('body').attributes;
    const appAttrs = parsed.querySelector('.application').attributes;

    expect(htmlAttrs).toEqual({
      class: 'html',
      lang: 'ru',
    });

    expect(bodyAttrs).toEqual({
      style: 'display: block; margin: 0',
    });

    expect(appAttrs).toEqual({
      class: 'application',
      'data-attr': 'value',
      bool: '',
    });
  });

  it('should add scripts and stylessheets', async () => {
    const { page } = await getPageWrapper('/');

    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]')).map(
        (script) => script.src
      );
    });

    const styles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')).map(
        (link) => link.href
      );
    });

    const preload = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel=preload]')).map(
        (link) => link.href
      );
    });

    const { staticUrl } = getApp();

    expect(scripts).toEqual([
      `${staticUrl}/dist/client/root.chunk.js`,
      `${staticUrl}/dist/client/react.js`,
      `${staticUrl}/dist/client/platform.js`,
    ]);
    expect(styles).toEqual(['']);
    expect(preload).toEqual([]);
  });

  it('should render image on ssr', async () => {
    const { page } = await getPageWrapper('/image/');

    const image = await page.evaluate(() => {
      const elem = document.getElementById('page-image');

      // @ts-ignore
      return elem?.src;
    });

    expect(image).toMatch(`${getApp().staticUrl}/`);
  });

  it('should render image on spa', async () => {
    const { page, router } = await getPageWrapper('/test/');

    await router.navigate('/image/');

    const image = await page.evaluate(() => {
      const elem = document.getElementById('page-image');

      // @ts-ignore
      return elem?.src;
    });

    expect(image).toMatch(`${getApp().staticUrl}/`);
  });
});
