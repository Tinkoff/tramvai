import type { TestFixture, BrowserContext, Page, Response } from '@playwright/test';
import type { CreateApp } from '@tramvai/internal-test-utils/fixtures/create-app';

export class PwaComponentObject {
  constructor(private page: Page, private context: BrowserContext, private app: CreateApp.App) {}

  async getSWUrl(): Promise<string> {
    await this.waitForSWRegistration();

    return this.page.evaluate(
      (serverUrl) =>
        window.navigator.serviceWorker
          .getRegistration()
          .then((registration) => (registration?.active?.scriptURL ?? '').replace(serverUrl, '')),
      this.app.serverUrl
    );
  }

  async getSWScope(): Promise<string> {
    await this.waitForSWRegistration();

    return this.page.evaluate(
      (serverUrl) =>
        window.navigator.serviceWorker
          .getRegistration()
          .then((registration) => (registration?.scope ?? '').replace(serverUrl, '')),
      this.app.serverUrl
    );
  }

  async getSWResponsesAfterReload(): Promise<Response[]> {
    const responses: Response[] = [];

    // webmanifest and icons not intercepted, can't find any issues
    this.page.on('response', (response) => {
      if (!response.fromServiceWorker()) {
        return;
      }

      responses.push(response);
    });

    await this.waitForSWRegistration();

    await this.page.reload({ waitUntil: 'networkidle' });

    return responses;
  }

  // @todo switch to https://playwright.dev/docs/service-workers-experimental after stable release
  waitForSWRegistration(): Promise<void> {
    return this.page.evaluate(() => {
      return navigator.serviceWorker.ready.then(() => {});
    });
  }

  async getWebmanifestUrl(): Promise<string> {
    const manifest = await this.page.locator('link[rel="manifest"]');

    return (await manifest.getAttribute('href')) ?? '';
  }

  async fetchWebmanifest(): Promise<Record<string, any>> {
    const url = await this.getWebmanifestUrl();

    return this.page.request.fetch(`${this.app.serverUrl}${url}`).then((res) => res.json());
  }

  async getThemeColor(): Promise<string> {
    const meta = await this.page.locator('meta[name="theme-color"]');

    return (await meta.getAttribute('content')) ?? '';
  }

  async getViewport(): Promise<string> {
    const meta = await this.page.locator('meta[name="viewport"]');

    return (await meta.getAttribute('content')) ?? '';
  }
}

export const PwaFixture: TestFixture<
  PwaComponentObject,
  { page: Page; context: BrowserContext; app: CreateApp.App }
> = async ({ page, context, app }, use) => {
  const Pwa = new PwaComponentObject(page, context, app);
  await use(Pwa);
};
