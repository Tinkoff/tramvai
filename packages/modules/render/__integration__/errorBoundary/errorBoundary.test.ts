import type { Page } from 'playwright-core';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { sleep } from '@tramvai/test-integration';

describe('errorBoundary', () => {
  const { getApp } = testApp({
    name: 'render',
    config: {
      polyfill: 'polyfill.ts',
      define: {
        development: {
          'process.env.TEST_DEFAULT_ERROR_BOUNDARY': 'true',
        },
      },
      fileSystemPages: {
        enabled: true,
        pagesDir: 'pages',
        routesDir: false,
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

  describe('Error page render, show specific page boundary from file-system pages', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-error-fs-specific-fallback/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-error-fs-specific-fallback/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('FS Pages Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-error-fs-specific-fallback/');

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('FS Pages Error Boundary');
    });
  });

  describe('Error page render, show default boundary fallback from token', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/token-default-error-boundary/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/token-default-error-boundary/');
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(pageContent).toBe('Token Default Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/token-default-error-boundary/');

      await sleep(100);

      const pageContent = await getPageContentTitle(page);

      expect(pageContent).toBe('Token Default Error Boundary');
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

      expect(documentContent).toMatchInlineSnapshot(`
        "<html lang="ru">
          <head>
            <title>Error Global Error at /global-error/</title>
          </head>
          <body>
            <h1>Root Error Boundary</h1>
          </body>
        </html>
        "
      `);
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/global-error/');

      const documentContent = await page.evaluate(() => {
        return document.documentElement.outerHTML;
      });

      expect(documentContent).toMatchInlineSnapshot(
        `"<html lang="ru"><head><title>Error &lt;!-- --&gt;Global Error&lt;!-- --&gt; at &lt;!-- --&gt;/global-error/</title></head><body><h1>Root Error Boundary</h1></body></html>"`
      );
    });
  });

  describe('Nested layout rendered when exception in page component', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-error-nested-layout/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-error-nested-layout/');
      const layoutContent = parsed.querySelector('nav').innerText;
      const pageContent = parsed.querySelector('main h1').innerText;

      expect(layoutContent).toBe('Nested Layout');
      expect(pageContent).toBe('Page Error Boundary');
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-error-nested-layout/');

      const layoutContent = await page.evaluate(() => {
        return document.querySelector('nav')?.innerText;
      });
      const pageContent = await getPageContentTitle(page);

      expect(layoutContent).toBe('Nested Layout');
      expect(pageContent).toBe('Page Error Boundary');
    });
  });

  describe('Nested layout error, root layout rendered', () => {
    it('HTTP status', async () => {
      const { request } = getApp();

      const { statusCode } = await request('/page-error-nested-layout-error/');

      expect(statusCode).toBe(500);
    });

    it('SSR render', async () => {
      const { render } = getApp();

      const { parsed } = await render('/page-error-nested-layout-error/');
      const documentContent = parsed.outerHTML;

      expect(documentContent).toMatchInlineSnapshot(`
        "<html lang="ru">
          <head>
            <title>Error Error Nested Layout SSR at /page-error-nested-layout-error/</title>
          </head>
          <body>
            <h1>Root Error Boundary</h1>
          </body>
        </html>
        "
      `);
    });

    it('SSR hydrate', async () => {
      const { page } = await getPageWrapper('/page-error-nested-layout-error/');

      const documentContent = await page.evaluate(() => {
        return document.documentElement.outerHTML;
      });

      expect(documentContent).toMatchInlineSnapshot(
        `"<html lang="ru"><head><title>Error &lt;!-- --&gt;Error Nested Layout SSR&lt;!-- --&gt; at &lt;!-- --&gt;/page-error-nested-layout-error/</title></head><body><h1>Root Error Boundary</h1></body></html>"`
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

    // to page-error-fs-specific-fallback

    await router.navigate('/page-error-fs-specific-fallback/');
    // wait for page and fallback components sequential loading
    await sleep(100);
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('FS Pages Error Boundary');

    // to page-error-not-existed

    await router.navigate('/page-error-not-existed/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Default Error Boundary');

    // to token-default-error-boundary

    await router.navigate('/token-default-error-boundary/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Token Default Error Boundary');

    // // to page-action-error

    await router.navigate('/page-action-error/');
    pageContentTitle = await getPageContentTitle(page);
    expect(pageContentTitle).toBe('Default Error Boundary');

    // // to page-guard-error

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
