import { startBrowser } from './browser';

module.exports = async () => {
  const browser = await startBrowser();

  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
};
