import fetch from 'node-fetch';
import { APP_INFO_TOKEN, provide } from '@tramvai/core';
import type { Cache } from '@tramvai/tokens-common';
import {
  CREATE_CACHE_TOKEN,
  ENV_MANAGER_TOKEN,
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import { getDiWrapper } from '@tramvai/test-helpers';
import {
  createMockAppInfo,
  createMockEnvManager,
  createMockLogger,
  createMockRequestManager,
  createMockCache,
} from '@tramvai/test-mocks';
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
    modules: [HttpClientModule, ...modules],
    providers: [
      provide({
        provide: ENV_MANAGER_TOKEN,
        useValue: createMockEnvManager(env),
      }),
      provide({
        provide: LOGGER_TOKEN,
        useValue: createMockLogger(),
      }),
      provide({
        provide: APP_INFO_TOKEN,
        useValue: createMockAppInfo(),
      }),
      provide({
        provide: REQUEST_MANAGER_TOKEN,
        useValue: createMockRequestManager(),
      }),
      provide({
        provide: CREATE_CACHE_TOKEN,
        useValue: () => {
          const cache = createMockCache();

          caches.push(cache);

          return cache;
        },
      }),
      ...providers,
    ],
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
