import type { Browser, BrowserServer } from 'playwright-core';
import { chromium } from 'playwright-core';
import { PLAYWRIGHT_DEFAULT_LAUNCH_OPTIONS } from './constants';
import { wrapPlaywrightPage } from './wrapper';

// проставляет данные в localStorage на домене, по факту не заходя ни на какую страницу
// идея взята из https://github.com/puppeteer/puppeteer/issues/3692#issuecomment-453186180
const enableBrowserLogger = async ({
  browser,
  serverUrl,
}: {
  browser: Browser;
  serverUrl: string;
}) => {
  const page = await browser.newPage();

  page.route('**/*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'text/plain',
      body: 'tweak me.',
    });
  });

  await page.goto(serverUrl, { timeout: 0 });

  await page.evaluate(() => {
    localStorage.setItem(
      '_t_logger',
      '{"level":10,"enabledName":["command:*"],"enabledLevel":[50]}'
    );
  });

  await page.close();
};

type PWOptions = Parameters<typeof chromium.launch>[0];

type Options = PWOptions & {
  enableLogging?: boolean;
};

export const initPlaywright = async (
  serverUrl: string,
  { enableLogging = true, ...options }: Options = {}
) => {
  const browser = await chromium.launch({
    ...PLAYWRIGHT_DEFAULT_LAUNCH_OPTIONS,
    ...options,
  });

  if (enableLogging) {
    await enableBrowserLogger({ browser, serverUrl });
  }

  return {
    browser,
    getPageWrapper: async (url?: string) => {
      const page = await browser.newPage();

      await page.setDefaultNavigationTimeout(60000);

      const wrapper = wrapPlaywrightPage(page);

      if (url) {
        await page.goto(url);
      }

      return wrapper;
    },
    close: () => {
      return browser.close();
    },
  };
};
