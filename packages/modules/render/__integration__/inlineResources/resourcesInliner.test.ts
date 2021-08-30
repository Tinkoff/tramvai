import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('render', () => {
  const { getApp } = testApp({
    name: 'render-inline-resource',
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  it('should inline styles', async () => {
    const { page } = await getPageWrapper('/');

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel=stylesheet]')).map(
        (link: HTMLLinkElement) => link.href
      );
    });
    const styles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('style')).map(
        (style: HTMLStyleElement) => style.innerText
      );
    });

    // Первый запуск, кеши ещё не прогреты, CSS не должен инлайниться.
    expect(links).toMatchInlineSnapshot(`
      Array [
        "${getApp().staticUrl}/dist/client/root.chunk.css",
      ]
    `);
    expect(styles).toMatchInlineSnapshot(`Array []`);

    await page.reload();

    const linksAfterReload = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel=stylesheet]')).map(
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
    // из-за добавления хешей в название css-классов нельзя сделать полный снапшот
    expect(stylesAfterReload.toString()).toContain('.root__main_');
    expect(stylesAfterReload.toString()).toContain('padding: 3px;');

    expect(linksAfterReload).not.toContain(`${getApp().staticUrl}/dist/client/root.chunk.css`);
    expect(dataHrefLinks.length).not.toBe(0);
  });
});
