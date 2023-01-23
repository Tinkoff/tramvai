import type { Page } from 'puppeteer';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';

describe('errorBoundary legacy', () => {
  const { getApp } = testApp({
    name: 'render',
    config: {
      commands: {
        build: {
          options: {
            polyfill: 'polyfill.ts',
          },
        },
      },
    },
  });
  const { getPageWrapper } = testAppInBrowser(getApp);

  describe('Error page render, show legacy boundary fallback', () => {
    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/legacy-error-boundary/');

      await sleep(100);

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Legacy Error Boundary');
    });
  });

  it('SPA-navigations', async () => {
    const { page, router } = await getPageWrapper('/');
    let pageContentTitle: string | undefined;

    // success-page

    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Page Component');

    // to legacy-error-boundary

    await router.navigate('/legacy-error-boundary/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Legacy Error Boundary');

    // to success-page

    await router.navigate('/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Page Component');
  });
});

function getPageContentTitle(page: Page) {
  return page.evaluate(() => {
    return document.querySelector<HTMLHeadingElement>('main h1')?.innerText;
  });
}
