import fetch from 'node-fetch';
import type { Cache } from '@tramvai/tokens-common';
import { getDiWrapper } from '@tramvai/test-helpers';
import { CommonTestModule } from '@tramvai/test-mocks';
import type { createMockEnvManager } from '@tramvai/test-mocks';
import { HttpClientModule } from '../../httpClientModule';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');
type Options = Parameters<typeof getDiWrapper>[0] & {
  env?: Parameters<typeof createMockEnvManager>[0];
};

export const testApi = (options: Options) => {
  const caches: Cache[] = [];
  const { modules = [], providers = [], env } = options;

  const { di } = getDiWrapper({
    di: options.di,
    modules: [
      CommonTestModule.forRoot({
        env,
        onCacheCreated: (cache: Cache) => {
          caches.push(cache);
        },
      }),
      HttpClientModule,
      ...modules,
    ],
    providers: [...providers],
  });

  const fetchMock: jest.Mock<ReturnType<typeof fetch>, Parameters<typeof fetch>> = fetch as any;

  const clearCaches = () => {
    caches.forEach((cache) => cache.clear());
  };

  return {
    di,
    fetchMock,
    mockJsonResponse: async (body: Record<string, any>, init: ResponseInit = {}) => {
      clearCaches();

      const { headers = {} } = init;

      fetchMock.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(body), {
            status: 200,
            ...init,
            headers: {
              'content-type': 'application/json',
              ...headers,
            },
          })
        )
      );
    },
    clearCaches,
  };
};
