import { resolve } from 'path';
import fetch from 'node-fetch';
import { testApp } from '@tramvai/internal-test-utils/testApp';
import { startExternalWebsite } from '@tramvai/internal-test-utils/utils/externalWebsite';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';

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
          options: {
            serverApiDir: resolve(__dirname, 'papi'),
          },
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

  describe('papi public file-api', () => {
    // eslint-disable-next-line jest/expect-expect
    it('GET requests to papi works', async () => {
      return getApp().papi.publicPapi('get-response').expect(200);
    });

    it('papi with manual handling', async () => {
      const { text } = await getApp().papi.publicPapi('manual-handle').expect(200);

      expect(text).toEqual('manual');
    });

    it('return parsed query content', async () => {
      const { body } = await getApp()
        .papi.publicPapi('query?a=1&b=2&test=test-content')
        .expect(200);

      expect(body.payload.data).toEqual('test-content');
    });

    it('should resolve user-agent through deps', async () => {
      const { body } = await getApp()
        .papi.publicPapi('user-agent-parse', {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
          },
        })
        .expect(200);

      expect(body).toMatchInlineSnapshot(`
        {
          "payload": {
            "browserEngine": "chrome",
            "major": "104",
            "name": "chrome",
            "version": "104.0.0.0",
          },
          "resultCode": "OK",
        }
      `);
    });
  });

  describe('papi private di-api', () => {
    it('POST form-data requests to papi works', async () => {
      const { body } = await getApp()
        .papi.privatePapi('post-response', {
          method: 'post',
          contentType: 'form',
          body: { is: 'urlencoded' },
        })
        .expect(200);

      expect(body.payload.is).toBe('urlencoded');
    });

    it('POST json data requests to papi works', async () => {
      const { body } = await getApp()
        .papi.privatePapi('post-response', {
          method: 'post',
          contentType: 'json',
          body: { is: 'json' },
        })
        .expect(200);

      expect(body.payload.is).toBe('json');
    });

    it('should parse cookies', async () => {
      const { body } = await getApp()
        .papi.privatePapi('get-cookie', { headers: { cookie: 'test=from-test' } })
        .expect(200);

      expect(body.payload).toBe('from-test');
    });

    it('should return error if timeout exceeded', async () => {
      const { body } = await getApp().papi.privatePapi('long-response').expect(503);

      expect(body).toEqual({
        resultCode: 'INTERNAL_ERROR',
        errorMessage: 'Execution timeout',
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('schema validation', async () => {
      await Promise.all([
        getApp().papi.privatePapi('schema-validation', { method: 'post' }).expect(400),
        getApp().papi.privatePapi('schema-validation', { method: 'post', body: {} }).expect(400),
        getApp()
          .papi.privatePapi('schema-validation', {
            method: 'post',
            body: { value: 'test' },
          })
          .expect(400),
        getApp()
          .papi.privatePapi('schema-validation', { method: 'post', body: { value: -2 } })
          .expect(400),
        getApp()
          .papi.privatePapi('schema-validation', { method: 'post', body: { value: 2 } })
          .expect(200),
      ]);
    });
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
