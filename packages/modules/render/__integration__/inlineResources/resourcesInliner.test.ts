import { testApp } from '@tramvai/internal-test-utils/testApp';
import { teremock } from '@tramvai/internal-test-utils/mock-server/client';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('resources inliner', () => {
  const { getApp } = testApp({
    name: 'render-inline-resource',
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('should not inline bad requests', async () => {
    teremock.add({
      url: 'https://test.acdn.tinkoff.ru/123.css',
      response: {
        body: 'some non-css stuff',
        status: 504,
      },
    });

    const { page } = await getPageWrapper();

    page.route('**/*', (route) => {
      if (route.request().url() === 'https://test.acdn.tinkoff.ru/123.css') {
        route.fulfill({
          body: '',
          status: 200,
        });
      } else {
        route.continue();
      }
    });

    await page.goto(`${getApp().serverUrl}/`);

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')).map(
        (link) => link.href
      );
    });
    const styles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('style')).map(
        (style: HTMLStyleElement) => style.innerText
      );
    });

    // Первый запуск, кеши ещё не прогреты, CSS не должен инлайниться.
    expect(links).toEqual([
      `${getApp().staticUrl}/dist/client/root.chunk.css`,
      'https://test.acdn.tinkoff.ru/123.css',
    ]);
    expect(styles).toMatchInlineSnapshot(`[]`);

    await page.reload();

    const linksAfterReload = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')).map(
        (link: HTMLLinkElement) => link.href
      );
    });
    const dataHrefLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-href]'));
    });
    const stylesAfterReload = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('style')).map(
        (style: HTMLStyleElement) => style.innerText
      );
    });
    const body = await page.evaluate(() => document.querySelector('body')?.outerHTML);
    expect(body).not.toContain('some non-css stuff');

    // из-за добавления хешей в название css-классов нельзя сделать полный снапшот
    expect(stylesAfterReload.toString()).toContain('.root__main_');
    expect(stylesAfterReload.toString()).toContain('padding: 3px;');

    expect(linksAfterReload).toContain('https://test.acdn.tinkoff.ru/123.css');
    expect(linksAfterReload).not.toContain(`${getApp().staticUrl}/dist/client/root.chunk.css`);
    expect(dataHrefLinks.length).not.toBe(0);
  });
});
