import type { Page } from 'puppeteer';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';

describe('errorBoundary', () => {
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

  describe('Success page render', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/');

      expect(statusCode).toBe(200);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Page Component');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Page Component');
    });
  });

  describe('Error page render, show default boundary', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-error-default-fallback/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-error-default-fallback/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Default Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-error-default-fallback/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Default Error Boundary');
    });
  });

  describe('Error page render, show specific page boundary', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-error-specific-fallback/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-error-specific-fallback/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Page Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-error-specific-fallback/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Page Error Boundary');
    });
  });

  describe('Error page render, show legacy boundary fallback', () => {
    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/legacy-error-boundary/');

      await sleep(100);

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Legacy Error Boundary');
    });
  });

  describe('Not existed page render, show default boundary', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-error-not-existed/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-error-not-existed/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Default Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-error-not-existed/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Default Error Boundary');
    });
  });

  describe('Action dispatch setPageErrorEvent, show default boundary', () => {
    it('Custom HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-action-error/');

      expect(statusCode).toBe(410);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-action-error/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Default Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-action-error/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Default Error Boundary');
    });
  });

  describe('Guard dispatch setPageErrorEvent, show default boundary', () => {
    it('Custom HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-guard-error/');

      expect(statusCode).toBe(503);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-guard-error/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Default Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-guard-error/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Default Error Boundary');
    });
  });

  describe('Global error, render root boundary', () => {
    it('Custom HTTP status and headers', async () => {
      const { request } = getApp();

      const { statusCode, headers } = await request('/global-error/');

      expect(statusCode).toBe(503);
      expect(headers).toMatchObject({
        'cache-control': 'no-cache, no-store, must-revalidate',
        'content-length': '152',
        'content-type': 'text/html; charset=utf-8',
      });
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/global-error/');
      const documentContent = parsed.outerHTML;

      expect(documentContent).toMatchInlineSnapshot(
        `"<html lang=\\"ru\\"><head><title>Error Global Error at /global-error/</title></head><body><h1>Root Error Boundary</h1></body></html>"`
      );
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/global-error/');

      const documentContent = await page.evaluate(() => {
        return document.documentElement.outerHTML;
      });

      expect(documentContent).toMatchInlineSnapshot(
        `"<html lang=\\"ru\\"><head><title>Error &lt;!-- --&gt;Global Error&lt;!-- --&gt; at &lt;!-- --&gt;/global-error/</title></head><body><h1>Root Error Boundary</h1></body></html>"`
      );
    });
  });

  it('SPA-navigations', async () => {
    const { page, router } = await getPageWrapper('/');
    let pageContentTitle: string | undefined;

    // success-page

    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Page Component');

    // to page-error-default-fallback

    await router.navigate('/page-error-default-fallback/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Default Error Boundary');

    // to page-error-specific-fallback

    await router.navigate('/page-error-specific-fallback/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Page Error Boundary');

    // to page-error-not-existed

    await router.navigate('/page-error-not-existed/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Default Error Boundary');

    // to legacy-error-boundary

    await router.navigate('/legacy-error-boundary/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Legacy Error Boundary');

    // to page-action-error

    await router.navigate('/page-action-error/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Default Error Boundary');

    // to page-guard-error

    await router.navigate('/page-guard-error/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Default Error Boundary');

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
