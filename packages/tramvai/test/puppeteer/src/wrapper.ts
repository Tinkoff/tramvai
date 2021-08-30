import type { Page } from 'puppeteer';
import { wrapRouter } from './router';

const checkSsrErrors = (text: string) => {
  if (text.indexOf('Server: "%s" Client: "%s"%s') !== -1) {
    throw new Error(`SSR breaking error: ${text}`);
  }
};

export const wrapPuppeteerPage = (page: Page) => {
  page.on('requestfailed', (request) =>
    console.log('[PAGE REQUEST FAILED]', {
      error: request.failure(),
      url: request.url(),
      headers: request.headers(),
    })
  );

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

    console.log(`[PAGE LOG]`, messages.length > 0 ? messages : text);
  });

  return {
    page,
    reset: (url = 'about:blank') => {
      return page.goto(url);
    },
    router: wrapRouter(page),
    close: () => {
      return page.close();
    },
  };
};
