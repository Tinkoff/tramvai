import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';
import { jsonLd } from './data/jsonLd';

describe('seo', () => {
  const { getApp } = testApp({
    name: 'seo',
  });

  describe('ssr', () => {
    const getHeadHtml = async (url: string) => {
      const app = getApp();
      const { head } = await app.render(url);

      return head.replace(new RegExp(app.staticUrl, 'g'), 'http://localhost:4000');
    };

    it('test default meta pack', async () => {
      expect(await getHeadHtml('/seo/default/')).toMatchSnapshot();
    });

    it('test common meta', async () => {
      expect(await getHeadHtml('/seo/common/')).toMatchSnapshot();
    });

    it('test twitter meta', async () => {
      expect(await getHeadHtml('/seo/twitter/')).toMatchSnapshot();
    });

    it('test og meta', async () => {
      expect(await getHeadHtml('/seo/og/')).toMatchSnapshot();
    });

    it('test json-ld meta', async () => {
      const { parsed } = await getApp().render('/seo/json-ld/', {
        parserOptions: { blockTextElements: { script: true, style: false } },
      });
      const jsonLdScript = parsed.querySelector('[type="application/ld+json"]');

      expect(jsonLdScript.innerHTML).toBe(JSON.stringify(jsonLd));
    });
  });

  describe('browser', () => {
    const { getPageWrapper } = testAppInBrowser(getApp);

    it('spa navigations should update meta tags', async () => {
      const { page, router } = await getPageWrapper('/seo/common/');
      expect(await page.title()).toBe('common seo');
      await router.navigate('../twitter');
      expect(await page.title()).toBe('twitter seo');
      await router.navigate('../og');
      expect(await page.title()).toBe('og seo');
    });

    it('should allow to update meta in page actions', async () => {
      const { page, router } = await getPageWrapper('/seo/dynamic/');
      expect(await page.title()).toBe('WoW, such dynamic!');
      await router.navigate('../common/');
      expect(await page.title()).toBe('common seo');
      await router.navigate('../dynamic/');
      await sleep(1000);
      expect(await page.title()).toBe('WoW, such dynamic!');
    });
  });
});
