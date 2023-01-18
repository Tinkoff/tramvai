import type { LaunchOptions } from 'playwright-core';

export const PLAYWRIGHT_DEFAULT_LAUNCH_OPTIONS: LaunchOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    process.env.HTTPS_PROXY ? `--proxy-server=${process.env.HTTPS_PROXY}` : '',
  ].filter(Boolean),
  headless: process.env.HEADLESS !== 'false',
  timeout: 60 * 3 * 1000,
};
