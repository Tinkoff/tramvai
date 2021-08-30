import type { Browser } from 'puppeteer';
import { launch } from 'puppeteer';
import { PUPPETEER_DEFAULT_LAUNCH_OPTIONS } from '@tramvai/test-puppeteer';

let browser: Browser;

export const startBrowser = async () => {
  browser = await launch(PUPPETEER_DEFAULT_LAUNCH_OPTIONS);
  return browser;
};

export const closeBrowser = async () => {
  return browser.close();
};
