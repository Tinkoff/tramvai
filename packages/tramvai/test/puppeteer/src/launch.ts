import isEmpty from '@tinkoff/utils/is/empty';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import { PUPPETEER_DEFAULT_LAUNCH_OPTIONS } from './constants';
import { wrapPuppeteerPage } from './wrapper';

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
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    r.respond({
      status: 200,
      contentType: 'text/plain',
      body: 'tweak me.',
    });
  });

  await page.goto(serverUrl);

  await page.evaluate(() => {
    localStorage.setItem(
      '_tinkoff_logger',
      '{"level":10,"enabledName":["command:*"],"enabledLevel":[50]}'
    );
  });

  await page.close();
};

type PuppeteerOptions = Parameters<typeof puppeteer.launch>[0];

type Options = PuppeteerOptions & {
  enableLogging?: boolean;
};

export const initPuppeteer = async (
  serverUrl: string,
  { enableLogging = true, ...options }: Options = {}
) => {
  const hasSharedBrowser = process.env.PUPPETEER_WS_ENDPOINT && isEmpty(options);
  let browser: Browser;

  if (hasSharedBrowser) {
    browser = await puppeteer.connect({
      browserWSEndpoint: process.env.PUPPETEER_WS_ENDPOINT,
    });

    browser.close = async () => {};
  } else {
    browser = await puppeteer.launch({
      ...PUPPETEER_DEFAULT_LAUNCH_OPTIONS,
      ...options,
    });
  }

  if (enableLogging) {
    await enableBrowserLogger({ browser, serverUrl });
  }

  return {
    browser,
    getPageWrapper: async (url?: string) => {
      const page = await browser.newPage();

      const wrapper = wrapPuppeteerPage(page);

      if (url) {
        await page.goto(url);
      }

      return wrapper;
    },
    close: () => {
      if (hasSharedBrowser) {
        return browser.disconnect();
      }

      return browser.close();
    },
  };
};
