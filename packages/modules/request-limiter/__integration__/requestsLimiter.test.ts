import { resolve } from 'path';
import type { PromiseType } from 'utility-types';
import { startProd } from '@tramvai/cli';
import fetch from 'node-fetch';
import autocannon from 'autocannon';
import waitOn from 'wait-on';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import env from '@tramvai/internal-test-utils/env';

const JEST_TIMEOUT = 10 * 60 * 1000;

declare module 'autocannon' {
  interface Result {
    statusCodeStats: Record<string, { count: number }>;
  }
}

describe('modules/requestsLimiter', () => {
  let port: number;
  let staticPort: number;
  let app: PromiseType<ReturnType<typeof startProd>>;

  beforeAll(async () => {
    [port, staticPort] = await Promise.all([getPort(), getPort()]);

    const root = __dirname;

    // TODO: think about adding possibility to use startProd through `@tramvai/test-integration`
    // currently there is a problem with resolving server and static urls
    app = await startProd({
      rootDir: root,
      config: {
        name: 'requestsLimiter',
        root,
        type: 'application',
        commands: {
          build: {
            configurations: {
              sourceMap: true,
            },
            options: {
              server: resolve(root, 'index.ts'),
            },
          },
        },
      },
      env,
      port,
      staticPort,
    });

    await waitOn({
      resources: [`http://localhost:${port}/readyz`],
    });
  }, JEST_TIMEOUT);

  afterAll(async () => {
    return app.close();
  }, 20000);

  it(
    'should provide decent performance',
    async () => {
      const serverUrl = `http://localhost:${port}`;

      const interval = setInterval(async () => {
        const startTime = Date.now();

        const response = await fetch(`${serverUrl}/readyz`);

        const requestTime = Date.now() - startTime;

        expect(response.status).toBe(200);
        expect(requestTime).toBeLessThan(5000);
      }, 5000);

      const { requests, statusCodeStats } = await autocannon({
        url: serverUrl,
        duration: '1m',
        connections: 1000,
        workers: 1,
        requests: [
          {
            path: '/',
          },
          {
            path: '/test/',
          },
          {
            path: '/unknown/',
          },
        ],
      });

      clearInterval(interval);

      const metricsResponse = await (await fetch(`${serverUrl}/metrics`)).text();

      expect(requests.average).toBeGreaterThan(1000);

      expect(Object.keys(statusCodeStats)).toHaveLength(3);

      expect(statusCodeStats['200'].count).toBeGreaterThan(100);
      expect(statusCodeStats['404'].count).toBeGreaterThan(100);
      expect(statusCodeStats['429'].count).toBeGreaterThan(50000);

      expect(metricsResponse).toContain('http_requests_total{method="GET",status="200"}');
      expect(metricsResponse).toContain('http_requests_total{method="GET",status="429"}');
      expect(metricsResponse).toContain('http_requests_total{method="GET",status="404"}');
    },
    JEST_TIMEOUT
  );
});
