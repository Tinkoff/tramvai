import { Module, provide } from '@tramvai/core';
import { ENV_MANAGER_TOKEN } from '@tramvai/tokens-common';
import type { HTTP_CLIENT } from '@tramvai/tokens-http-client';
import { HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import { testApi } from './testApi';

describe('testApi', () => {
  it('should allow to test custom http service', async () => {
    @Module({
      providers: [
        provide({
          provide: 'CUSTOM_HTTP_CLIENT',
          useFactory: ({ factory, envManager }) => {
            return factory({
              name: 'custom-api',
              baseUrl: envManager.get('TEST_API'),
            });
          },
          deps: {
            factory: HTTP_CLIENT_FACTORY,
            envManager: ENV_MANAGER_TOKEN,
          },
        }),
      ],
    })
    class CustomModule {}

    const { di, fetchMock, mockJsonResponse } = testApi({
      modules: [CustomModule],
      env: {
        TEST_API: 'testApi',
      },
    });
    const httpClient: typeof HTTP_CLIENT = di.get('CUSTOM_HTTP_CLIENT') as any;

    mockJsonResponse({ a: 'aaa' });

    const { payload } = await httpClient.get('test');

    expect(payload).toEqual({ a: 'aaa' });
    expect(fetchMock).toHaveBeenCalledWith('http://testApi/test', expect.anything());
  });
});
