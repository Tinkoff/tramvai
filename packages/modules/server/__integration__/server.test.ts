import { testApp } from '@tramvai/internal-test-utils/testApp';
import { startExternalWebsite } from '@tramvai/internal-test-utils/utils/externalWebsite';

describe('module-server', () => {
  const { getPort } = startExternalWebsite();

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
                  return getPort();
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
});
