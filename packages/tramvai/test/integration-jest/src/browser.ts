import type { BrowserServer } from 'playwright-core';
import { chromium } from 'playwright-core';
import { PLAYWRIGHT_DEFAULT_LAUNCH_OPTIONS } from '@tramvai/test-pw';

let browser: BrowserServer;

export const startBrowser = async () => {
  browser = await chromium.launchServer(PLAYWRIGHT_DEFAULT_LAUNCH_OPTIONS);
  return browser;
};

export const closeBrowser = async () => {
  return browser.close();
};
