import fetch from 'node-fetch';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { startExternalWebsite } from '@tramvai/internal-test-utils/utils/externalWebsite';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';

describe('module-server', () => {
  const externalWebsite = startExternalWebsite();
  let utilityPort: number;

  beforeAll(async () => {
    utilityPort = await getPort();
  });

  describe('default utility port', () => {
    const { getApp } = testApp({
      name: 'server',
      config: {
        commands: {
          build: {
            configurations: {
              definePlugin: {
                dev: {
                  // через геттер, т.к. иначе в объекте будет свойство до иницилизации переменной port, т.е. undefined
                  get 'process.env.EXTERNAL_WEBSITE_PORT'() {
                    return externalWebsite.getPort();
                  },
                },
              },
            },
          },
        },
      },
    });

    // eslint-disable-next-line jest/expect-expect
    it('GET requests to application pages works', async () => {
      getApp().request('/').expect(200);
    });

    // eslint-disable-next-line jest/expect-expect
    it('POST requests to application pages works', async () => {
      return getApp().request('/', { method: 'post' }).expect(200);
    });

    // eslint-disable-next-line jest/expect-expect
    it('GET requests to papi works', async () => {
      return getApp().request('/server/papi/get-response').expect(200);
    });

    it('POST form-data requests to papi works', async () => {
      await getApp()
        .request('/server/papi/post-response', {
          method: 'post',
          contentType: 'form',
          body: { is: 'urlencoded' },
        })
        .expect(200)
        .then((response) => {
          expect(response.body.payload.is).toBe('urlencoded');
        });
    });

    it('POST json data requests to papi works', async () => {
      await getApp()
        .request('/server/papi/post-response', {
          method: 'post',
          contentType: 'json',
          body: { is: 'json' },
        })
        .expect(200)
        .then((response) => {
          expect(response.body.payload.is).toBe('json');
        });
    });

    it('proxy should work', async () => {
      const { headers } = await getApp().request('/from/');

      // Проверяем, что проставился корректный заголовок.
      expect(headers['x-tramvai-proxied-response']).toEqual('1');
    });

    it('serve static files should work', async () => {
      // file from test/public/test.json
      const response = await getApp().request('/test.json');

      expect(response.headers['content-type']).toEqual('application/json; charset=UTF-8');
      expect(response.body).toEqual({ key: 'value' });
    });

    // eslint-disable-next-line jest/expect-expect
    it('returns utility paths', async () => {
      const { request } = getApp();

      await Promise.all([
        request('/healthz').expect(200),
        request('/metrics').expect(200, /# TYPE http_requests_total counter/),
      ]);
    });
  });

  describe('custom utility port', () => {
    const { getApp } = testApp(
      {
        name: 'server',
        config: {
          commands: {
            build: {
              configurations: {
                definePlugin: {
                  dev: {
                    // через геттер, т.к. иначе в объекте будет свойство до иницилизации переменной port, т.е. undefined
                    get 'process.env.EXTERNAL_WEBSITE_PORT'() {
                      return externalWebsite.getPort();
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        env: {
          get UTILITY_SERVER_PORT() {
            return `${utilityPort}`;
          },
        },
      }
    );

    // eslint-disable-next-line jest/expect-expect
    it('GET requests to application pages works', async () => {
      getApp().request('/').expect(200);
    });

    // eslint-disable-next-line jest/expect-expect
    it('returns utility paths', async () => {
      expect(await fetch(`http://localhost:${utilityPort}/healthz`)).toMatchObject({ status: 200 });
      const response = await fetch(`http://localhost:${utilityPort}/metrics`);

      expect(response.status).toBe(200);

      expect(await response.text()).toMatch(/# TYPE http_requests_total counter/);
    });
  });
});
