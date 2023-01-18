import type { Page } from 'playwright-core';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { testAppInBrowser } from '@tramvai/internal-test-utils/browser';

describe('modules/metrics/instantMetrics', () => {
  let page: Page;
  let completedRequests: any[];

  const { getApp } = testApp({
    name: 'metrics',
  });
  const { getBrowser } = testAppInBrowser(getApp);

  const getMetrics = async () => {
    const { request } = getApp();

    const { text: metrics } = await request('/metrics').expect(200);

    return metrics.split('\n\n').reduce((acc, metric) => {
      const lines = metric.split('\n');
      const type = lines[1].split(' ')[2];

      acc[type] = lines
        .slice(2, Infinity)
        .map((line) => line.split(' ')[0])
        .join('\n');

      return acc;
    }, {} as Record<string, string>);
  };

  beforeEach(async () => {
    page = await getBrowser().newPage();
    completedRequests = [];

    await page.on('request', (request) => {
      completedRequests.push({
        method: request.method(),
        url: request.url(),
        postData: request.postData(),
      });
    });
  });

  it('Отправляет instant метрику если event соответствует сущетсвующей метрике', async () => {
    await page.goto(`${getApp().serverUrl}/`, { waitUntil: 'networkidle' });

    expect(completedRequests).toEqual(
      expect.arrayContaining([
        {
          method: 'POST',
          postData: null,
          url: expect.stringContaining('metrics/sent-instant-metric'),
        },
      ])
    );
  });

  it('Не отправляет метрику если таковая не заведена', async () => {
    await page.goto(`${getApp().serverUrl}/`, { waitUntil: 'networkidle' });

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

  it.skip('should return commandLine metrics', async () => {
    let metrics = await getMetrics();

    expect(metrics.command_line_runner_execution_time).toMatchInlineSnapshot(`
    "command_line_runner_execution_time_bucket{le="0.01",line="init"}
    command_line_runner_execution_time_bucket{le="0.025",line="init"}
    command_line_runner_execution_time_bucket{le="0.05",line="init"}
    command_line_runner_execution_time_bucket{le="0.1",line="init"}
    command_line_runner_execution_time_bucket{le="0.25",line="init"}
    command_line_runner_execution_time_bucket{le="0.5",line="init"}
    command_line_runner_execution_time_bucket{le="1",line="init"}
    command_line_runner_execution_time_bucket{le="2.5",line="init"}
    command_line_runner_execution_time_bucket{le="5",line="init"}
    command_line_runner_execution_time_bucket{le="10",line="init"}
    command_line_runner_execution_time_bucket{le="20",line="init"}
    command_line_runner_execution_time_bucket{le="40",line="init"}
    command_line_runner_execution_time_bucket{le="60",line="init"}
    command_line_runner_execution_time_bucket{le="+Inf",line="init"}
    command_line_runner_execution_time_sum{line="init"}
    command_line_runner_execution_time_count{line="init"}
    command_line_runner_execution_time_bucket{le="0.01",line="listen"}
    command_line_runner_execution_time_bucket{le="0.025",line="listen"}
    command_line_runner_execution_time_bucket{le="0.05",line="listen"}
    command_line_runner_execution_time_bucket{le="0.1",line="listen"}
    command_line_runner_execution_time_bucket{le="0.25",line="listen"}
    command_line_runner_execution_time_bucket{le="0.5",line="listen"}
    command_line_runner_execution_time_bucket{le="1",line="listen"}
    command_line_runner_execution_time_bucket{le="2.5",line="listen"}
    command_line_runner_execution_time_bucket{le="5",line="listen"}
    command_line_runner_execution_time_bucket{le="10",line="listen"}
    command_line_runner_execution_time_bucket{le="20",line="listen"}
    command_line_runner_execution_time_bucket{le="40",line="listen"}
    command_line_runner_execution_time_bucket{le="60",line="listen"}
    command_line_runner_execution_time_bucket{le="+Inf",line="listen"}
    command_line_runner_execution_time_sum{line="listen"}
  `);

    await page.goto(`${getApp().serverUrl}/`);

    metrics = await getMetrics();

    expect(metrics.command_line_runner_execution_time).toMatchInlineSnapshot(`
    "command_line_runner_execution_time_bucket{le="0.01",line="init"}
    command_line_runner_execution_time_bucket{le="0.025",line="init"}
    command_line_runner_execution_time_bucket{le="0.05",line="init"}
    command_line_runner_execution_time_bucket{le="0.1",line="init"}
    command_line_runner_execution_time_bucket{le="0.25",line="init"}
    command_line_runner_execution_time_bucket{le="0.5",line="init"}
    command_line_runner_execution_time_bucket{le="1",line="init"}
    command_line_runner_execution_time_bucket{le="2.5",line="init"}
    command_line_runner_execution_time_bucket{le="5",line="init"}
    command_line_runner_execution_time_bucket{le="10",line="init"}
    command_line_runner_execution_time_bucket{le="20",line="init"}
    command_line_runner_execution_time_bucket{le="40",line="init"}
    command_line_runner_execution_time_bucket{le="60",line="init"}
    command_line_runner_execution_time_bucket{le="+Inf",line="init"}
    command_line_runner_execution_time_sum{line="init"}
    command_line_runner_execution_time_count{line="init"}
    command_line_runner_execution_time_bucket{le="0.01",line="listen"}
    command_line_runner_execution_time_bucket{le="0.025",line="listen"}
    command_line_runner_execution_time_bucket{le="0.05",line="listen"}
    command_line_runner_execution_time_bucket{le="0.1",line="listen"}
    command_line_runner_execution_time_bucket{le="0.25",line="listen"}
    command_line_runner_execution_time_bucket{le="0.5",line="listen"}
    command_line_runner_execution_time_bucket{le="1",line="listen"}
    command_line_runner_execution_time_bucket{le="2.5",line="listen"}
    command_line_runner_execution_time_bucket{le="5",line="listen"}
    command_line_runner_execution_time_bucket{le="10",line="listen"}
    command_line_runner_execution_time_bucket{le="20",line="listen"}
    command_line_runner_execution_time_bucket{le="40",line="listen"}
    command_line_runner_execution_time_bucket{le="60",line="listen"}
    command_line_runner_execution_time_bucket{le="+Inf",line="listen"}
    command_line_runner_execution_time_sum{line="listen"}
    command_line_runner_execution_time_count{line="listen"}
    command_line_runner_execution_time_bucket{le="0.01",line="customer_start"}
    command_line_runner_execution_time_bucket{le="0.025",line="customer_start"}
    command_line_runner_execution_time_bucket{le="0.05",line="customer_start"}
    command_line_runner_execution_time_bucket{le="0.1",line="customer_start"}
    command_line_runner_execution_time_bucket{le="0.25",line="customer_start"}
    command_line_runner_execution_time_bucket{le="0.5",line="customer_start"}
    command_line_runner_execution_time_bucket{le="1",line="customer_start"}
    command_line_runner_execution_time_bucket{le="2.5",line="customer_start"}
    command_line_runner_execution_time_bucket{le="5",line="customer_start"}
    command_line_runner_execution_time_bucket{le="10",line="customer_start"}
    command_line_runner_execution_time_bucket{le="20",line="customer_start"}
    command_line_runner_execution_time_bucket{le="40",line="customer_start"}
    command_line_runner_execution_time_bucket{le="60",line="customer_start"}
    command_line_runner_execution_time_bucket{le="+Inf",line="customer_start"}
    command_line_runner_execution_time_sum{line="customer_start"}
    command_line_runner_execution_time_count{line="customer_start"}
    command_line_runner_execution_time_bucket{le="0.01",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="0.025",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="0.05",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="0.1",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="0.25",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="0.5",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="1",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="2.5",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="5",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="10",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="20",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="40",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="60",line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="+Inf",line="resolve_user_deps"}
    command_line_runner_execution_time_sum{line="resolve_user_deps"}
    command_line_runner_execution_time_count{line="resolve_user_deps"}
    command_line_runner_execution_time_bucket{le="0.01",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="0.025",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="0.05",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="0.1",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="0.25",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="0.5",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="1",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="2.5",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="5",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="10",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="20",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="40",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="60",line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="+Inf",line="resolve_page_deps"}
    command_line_runner_execution_time_sum{line="resolve_page_deps"}
    command_line_runner_execution_time_count{line="resolve_page_deps"}
    command_line_runner_execution_time_bucket{le="0.01",line="generate_page"}
    command_line_runner_execution_time_bucket{le="0.025",line="generate_page"}
    command_line_runner_execution_time_bucket{le="0.05",line="generate_page"}
    command_line_runner_execution_time_bucket{le="0.1",line="generate_page"}
    command_line_runner_execution_time_bucket{le="0.25",line="generate_page"}
    command_line_runner_execution_time_bucket{le="0.5",line="generate_page"}
    command_line_runner_execution_time_bucket{le="1",line="generate_page"}
    command_line_runner_execution_time_bucket{le="2.5",line="generate_page"}
    command_line_runner_execution_time_bucket{le="5",line="generate_page"}
    command_line_runner_execution_time_bucket{le="10",line="generate_page"}
    command_line_runner_execution_time_bucket{le="20",line="generate_page"}
    command_line_runner_execution_time_bucket{le="40",line="generate_page"}
    command_line_runner_execution_time_bucket{le="60",line="generate_page"}
    command_line_runner_execution_time_bucket{le="+Inf",line="generate_page"}
    command_line_runner_execution_time_sum{line="generate_page"}
    command_line_runner_execution_time_count{line="generate_page"}
    command_line_runner_execution_time_bucket{le="0.01",line="clear"}
    command_line_runner_execution_time_bucket{le="0.025",line="clear"}
    command_line_runner_execution_time_bucket{le="0.05",line="clear"}
    command_line_runner_execution_time_bucket{le="0.1",line="clear"}
    command_line_runner_execution_time_bucket{le="0.25",line="clear"}
    command_line_runner_execution_time_bucket{le="0.5",line="clear"}
    command_line_runner_execution_time_bucket{le="1",line="clear"}
    command_line_runner_execution_time_bucket{le="2.5",line="clear"}
    command_line_runner_execution_time_bucket{le="5",line="clear"}
    command_line_runner_execution_time_bucket{le="10",line="clear"}
    command_line_runner_execution_time_bucket{le="20",line="clear"}
    command_line_runner_execution_time_bucket{le="40",line="clear"}
    command_line_runner_execution_time_bucket{le="60",line="clear"}
    command_line_runner_execution_time_bucket{le="+Inf",line="clear"}
    command_line_runner_execution_time_sum{line="clear"}
    command_line_runner_execution_time_count{line="clear"}"
  `);
  });

  it('Send instant metric if event has correspond metric', async () => {
    await page.goto(`${getApp().serverUrl}/`, { waitUntil: 'networkidle' });

    expect(completedRequests).toEqual(
      expect.arrayContaining([
        {
          method: 'POST',
          postData: null,
          url: expect.stringContaining('metrics/sent-instant-metric'),
        },
      ])
    );
  });

  it('Do not send instant metric if metric does not exist', async () => {
    await page.goto(`${getApp().serverUrl}/`, { waitUntil: 'networkidle' });

    expect(completedRequests).toEqual(
      expect.not.arrayContaining([
        { method: 'POST', url: expect.stringContaining('metrics/didntsend-instant-metric') },
      ])
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('return http_request_total metrics', async () => {
    const metrics = await getMetrics();

    expect(metrics.http_requests_total).toMatchInlineSnapshot(
      `"http_requests_total{method="GET",status="200"}"`
    );
  });
});
