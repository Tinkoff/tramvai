import type puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import { sleep } from '@tramvai/test-integration';

describe('modules/metrics/instantMetrics', () => {
  describe('default app port', () => {
    let page: puppeteer.Page;
    let completedRequests: any[];

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
      await page.goto(`${getApp().serverUrl}/`, { waitUntil: 'networkidle0' });

      expect(completedRequests).toEqual(
        expect.not.arrayContaining([
          { method: 'POST', url: expect.stringContaining('metrics/didntsend-instant-metric') },
        ])
      );
    });

    // eslint-disable-next-line jest/expect-expect
    it('Возвращает метрики по урлу /metrics', async () => {
      const { request } = getApp();

      await request('/metrics').expect(
        200,
        /# TYPE http_requests_total counter\nhttp_requests_total{method="\w+",status="\d+"} \d+/
      );
    });
  });

  describe('custom metrics port', () => {
    let metricsPort: number;

    beforeAll(async () => {
      metricsPort = await getPort();
    });

    const { getApp } = testApp({
      name: 'metrics',
      config: {
        commands: {
          build: {
            configurations: {
              definePlugin: {
                dev: {
                  // через геттер, т.к. иначе в объекте будет свойство до иницилизации переменной port, т.е. undefined
                  get 'process.env.METRICS_PORT'() {
                    return metricsPort;
                  },
                },
              },
            },
          },
        },
      },
    });

    it('Возвращает метрики по урлу /metrics', async () => {
      await getApp().request('/').expect(200);

      const response = await fetch(`http://localhost:${metricsPort}/metrics`);

      expect(response.status).toBe(200);

      expect(await response.text()).toMatch(
        /# TYPE http_requests_total counter\nhttp_requests_total{method="\w+",status="\d+"} \d+/
      );
    });
  });
});
