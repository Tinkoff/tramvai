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

  it('proxy should work', async () => {
    const { headers } = await getApp().request('/from/');

    // Проверяем, что проставился корректный заголовок.
    expect(headers['x-tramvai-proxied-response']).toEqual('1');
  });
});
