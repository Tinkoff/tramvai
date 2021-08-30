import puppeteer from 'puppeteer';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('modules/metrics/instantMetrics', () => {
  let page: puppeteer.Page;
  let completedRequests;

  const { getApp } = testApp({
    name: 'metrics',
  });
  const { getBrowser } = testAppInBrowser(getApp);

  beforeEach(async () => {
    page = await getBrowser().newPage();
    completedRequests = [];
    await page.setRequestInterception(true);

    await page.on('request', (request) => {
      completedRequests.push({
        method: request.method(),
        url: request.url(),
        postData: request.postData(),
      });

      request.continue();
    });
  });

  afterEach(async () => {
    await page.setRequestInterception(false);
  });

  it('Отправляет instant метрику если event соответствует сущетсвующей метрике', async () => {
    await page.goto(`${getApp().serverUrl}/`, { waitUntil: 'networkidle0' });

    expect(completedRequests).toEqual(
      expect.arrayContaining([
        { method: 'POST', url: expect.stringContaining('metrics/sent-instant-metric') },
      ])
    );
  });

  it('Не отправляет метрику если таковая не заведена', async () => {
    await page.goto(`${getApp().serverUrl}/`, {
      waitUntil: 'networkidle0',
    });

    expect(completedRequests).toEqual(
      expect.not.arrayContaining([
        { method: 'POST', url: expect.stringContaining('metrics/didntsend-instant-metric') },
      ])
    );
  });
  it('Возвращает метрики по урлу /metrics', async () => {
    const { request } = getApp();

    await request('/metrics').expect(200, /# TYPE http_requests_total counter/);
  });
});
