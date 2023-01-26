import type { Page } from 'playwright-core';
import { stderr as stderrSupportsColor } from 'supports-color';
// @ts-ignore
import consoleWithStyle from 'console-with-style';
import { wrapRouter } from './router';
import { waitHydrated } from './utils';

const checkSsrErrors = (text: string) => {
  if (
    // react@<18
    text.indexOf('Server: "%s" Client: "%s"%s') !== -1 ||
    // react@18
    text.indexOf(
      'An error occurred during hydration. The server HTML was replaced with client content'
    ) !== -1
  ) {
    throw new Error(`SSR breaking error: ${text}`);
  }
};

const format = consoleWithStyle((stderrSupportsColor && stderrSupportsColor.level) || 0);

declare global {
  // eslint-disable-next-line no-var
  var nativeConsole: typeof console;
}
const { nativeConsole } = global;

export const wrapPlaywrightPage = (page: Page) => {
  if (page.url() && page.url() !== 'about:blank') {
    throw new Error(
      `You should wrap blank page before navigation, but page already has url "${page.url()}"`
    );
  }

  const originalGoto = page.goto;

  // wait for page loading and hydration, because selective hydration ends later
  // eslint-disable-next-line no-param-reassign
  page.goto = async function goto(...args) {
    const [response] = await Promise.all([
      originalGoto.apply(page, args),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);
    await waitHydrated(page);
    return response;
  };

  page.on('requestfailed', (request) =>
    nativeConsole.error('[PAGE REQUEST FAILED]', {
      error: request.failure(),
      url: request.url(),
      headers: request.headers(),
    })
  );

  page.on('crash', (error) => {
    nativeConsole.error(`[PAGE CRASHED]`, error);
  });

  page.on('pageerror', (error) => {
    nativeConsole.error(`[PAGE ERROR]`, error.message);
  });

  page.on('console', async (consoleObj) => {
    const args = consoleObj.args();
    const text = consoleObj.text();
    const messages = [];

    checkSsrErrors(text);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      const json = await arg.jsonValue().catch(() => null);

      messages.push(json);
    }

    const logLevel = consoleObj.type() === 'error' ? 'error' : 'log';
    const consoleArgs = messages.length ? messages : [text];
    nativeConsole[logLevel](`[PAGE ${consoleObj.type().toUpperCase()}]`, format(...consoleArgs));
  });

  return {
    page,
    reset: (url = 'about:blank') => {
      return page.goto(url);
    },
    waitForUrl: (url: string) => {
      return page.waitForFunction((expectedUrl: string) => {
        return window.location.href === expectedUrl;
      }, url);
    },
    router: wrapRouter(page),
    close: () => {
      return page.close();
    },
  };
};
