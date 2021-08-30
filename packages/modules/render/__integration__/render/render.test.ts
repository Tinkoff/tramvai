import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('render', () => {
  const { getApp } = testApp({
    name: 'render',
    config: {
      commands: {
        build: {
          options: {
            vendor: 'vendor.ts',
            polyfill: 'polyfill.ts',
          },
        },
      },
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
      style: 'display: block; margin: 0;',
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
      return Array.from(document.querySelectorAll('script[src]')).map(
        (script: HTMLScriptElement) => script.src
      );
    });

    const styles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel=stylesheet]')).map(
        (link: HTMLLinkElement) => link.href
      );
    });

    const preload = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel=preload]')).map(
        (link: HTMLLinkElement) => link.href
      );
    });

    const { staticUrl } = getApp();

    expect(scripts).toMatchInlineSnapshot(`
      Array [
        "${staticUrl}/dist/client/vendor.js",
        "${staticUrl}/dist/client/root.chunk.js",
        "${staticUrl}/dist/client/platform.js",
      ]
    `);
    expect(styles).toMatchInlineSnapshot(`
Array [
  "",
]
`);
    expect(preload).toMatchInlineSnapshot(`Array []`);
  });
});
