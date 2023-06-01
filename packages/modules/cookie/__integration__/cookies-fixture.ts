import type { TestFixture, WorkerFixture, BrowserContext, Page } from '@playwright/test';
import type { CreateApp } from '@tramvai/internal-test-utils/fixtures/create-app';
import type Server from 'http-proxy';
import { startHttpsProxyServer } from './utils/https-proxy';

export type ProxyServer = {
  port: number;
  server: Server;
};

export const proxyHttpsServerFixture: [
  WorkerFixture<ProxyServer, { createApp: CreateApp.CreateCustomApp }>,
  { scope: 'worker'; timeout: number }
] = [
  async ({ createApp }, use) => {
    const { port, proxy } = await startHttpsProxyServer({
      targetPort: Number(new URL(createApp.serverUrl).port),
    });

    await use({ port, server: proxy });

    proxy.close();
  },
  { scope: 'worker', timeout: 60000 },
];

export const proxyHttpsStaticServerFixture: [
  WorkerFixture<{}, { createApp: CreateApp.CreateCustomApp; optionsApp: CreateApp.OptionsApp }>,
  { scope: 'worker'; timeout: number }
] = [
  async ({ createApp, optionsApp }, use) => {
    const { proxy } = await startHttpsProxyServer({
      sourcePort: Number(new URL(optionsApp.env!.ASSETS_PREFIX).port),
      targetPort: Number(new URL(createApp.staticUrl).port),
    });

    await use({});

    proxy.close();
  },
  { scope: 'worker', timeout: 60000 },
];

export class CookieComponentObject {
  constructor(private page: Page, private context: BrowserContext) {}

  async setTestCookie() {
    return this.page.evaluate(
      'contextExternal.di.get("cookieManager").set({ name: "testcookies", value: "true"})'
    );
  }

  async getTestCookie() {
    const cookies = await this.context.cookies();
    const testCookie = cookies.find((c) => c.name === 'testcookies');

    return testCookie?.value;
  }
}

export const CookieFixture: TestFixture<
  CookieComponentObject,
  { page: Page; context: BrowserContext }
> = async ({ page, context }, use) => {
  const Cookie = new CookieComponentObject(page, context);
  await use(Cookie);
};
