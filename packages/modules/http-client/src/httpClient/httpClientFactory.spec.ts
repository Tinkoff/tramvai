/* eslint-disable import/first */
jest.mock('node-fetch');

import fetch from 'node-fetch';
import { testModule } from '@tramvai/test-unit';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN, REQUEST_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { HTTP_CLIENT_FACTORY } from '@tramvai/tokens-http-client';
import { APP_INFO_TOKEN } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import type { Provider } from '@tinkoff/dippy';
import { createLoggerMocks, clearLoggerMocks } from '../../../../../test/mocks/tramvai/logger';
import {
  createRequestManagerMock,
  clearRequestManagerMock,
} from '../../../../../test/mocks/tramvai/requestManager';
import {
  createEnvManagerMock,
  clearEnvManagerMock,
} from '../../../../../test/mocks/tramvai/envManager';
import { createJsonResponse } from '../../../../../test/utils/fetch';
import { HttpClientModule } from '../httpClientModule';

const { loggerMock, loggerFactoryMock } = createLoggerMocks();
const requestManagerMock = createRequestManagerMock();
const envManagerMock = createEnvManagerMock();

const mockHttpClientFactory = (providers: Provider[] = []) => {
  const { di } = testModule(HttpClientModule, {
    modules: [CommonModule],
    providers: [
      {
        provide: ENV_MANAGER_TOKEN,
        useValue: envManagerMock,
      },
      {
        provide: LOGGER_TOKEN,
        useValue: loggerFactoryMock,
      },
      {
        provide: REQUEST_MANAGER_TOKEN,
        useValue: requestManagerMock,
      },
      {
        provide: APP_INFO_TOKEN,
        useValue: {
          appName: 'example',
        },
      },
      ...providers,
    ],
  });

  return di.get(HTTP_CLIENT_FACTORY);
};

describe('httpClientFactory', () => {
  let factory: typeof HTTP_CLIENT_FACTORY;

  beforeEach(() => {
    factory = mockHttpClientFactory();
  });

  afterEach(() => {
    clearLoggerMocks({ loggerMock, loggerFactoryMock });
    clearRequestManagerMock(requestManagerMock);
    clearEnvManagerMock(envManagerMock);
    (fetch as any).mockClear();
  });

  it('cache enabled by default', async () => {
    (fetch as any).mockImplementation(() =>
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const httpClient = factory({ name: 'test-api' });

    await httpClient.request({ path: 'fake' });
    await httpClient.request({ path: 'fake' });

    expect(fetch).toBeCalledTimes(1);
  });

  it('cache disabled with env HTTP_CLIENT_CACHE_DISABLED', async () => {
    envManagerMock.get.mockImplementation((env) => {
      if (env === 'HTTP_CLIENT_CACHE_DISABLED') {
        return true;
      }
      if (env === 'APP_VERSION') {
        return '1.0.0';
      }
      if (env === 'APP_RELEASE') {
        return 'fake_release';
      }
      return null;
    });

    (fetch as any).mockImplementation(() =>
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const httpClient = factory({ name: 'test-api' });

    await httpClient.request({ path: 'fake' });
    await httpClient.request({ path: 'fake' });

    expect(fetch).toBeCalledTimes(2);
  });

  it('disableCache property overwrite with env HTTP_CLIENT_CACHE_DISABLED', async () => {
    envManagerMock.get.mockImplementation((env) => {
      if (env === 'HTTP_CLIENT_CACHE_DISABLED') {
        return true;
      }
      return null;
    });

    (fetch as any).mockImplementation(() =>
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const httpClient = factory({
      name: 'test-api',
      disableCache: false,
    });

    await httpClient.request({ path: 'fake' });
    await httpClient.request({ path: 'fake' });

    expect(fetch).toBeCalledTimes(2);
  });

  it('add User-Agent and X-real-ip headers by default', async () => {
    requestManagerMock.getClientIp.mockImplementationOnce(() => '127.0.0.1');

    (fetch as any).mockImplementation(() =>
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const httpClient = factory({ name: 'test-api' });

    await httpClient.request({ path: 'fake' });

    const fetchOptions = (fetch as any).mock.calls[0][1];

    expect(fetchOptions.headers).toMatchInlineSnapshot(`
Object {
  "Content-type": "application/x-www-form-urlencoded",
  "User-Agent": "tramvai example",
  "X-real-ip": "127.0.0.1",
}
`);
  });

  it('merge request and default headers', async () => {
    requestManagerMock.getClientIp.mockImplementationOnce(() => '127.0.0.1');

    (fetch as any).mockImplementation(() =>
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const httpClient = factory({ name: 'test-api' });

    await httpClient.request({ path: 'fake', headers: { foo: 'bar' } });

    const fetchOptions = (fetch as any).mock.calls[0][1];

    expect(fetchOptions.headers).toMatchInlineSnapshot(`
Object {
  "Content-type": "application/x-www-form-urlencoded",
  "User-Agent": "tramvai example",
  "X-real-ip": "127.0.0.1",
  "foo": "bar",
}
`);
  });

  it('circuit breaker works', async () => {
    (fetch as any).mockImplementation(() =>
      createJsonResponse(
        {
          error: {
            message: 'Internal Server Error',
          },
        },
        {
          status: 500,
        }
      )
    );

    const httpClient = factory({
      baseUrl: 'https://test-api.com/',
      name: 'test-api',
      enableCircuitBreaker: true,
    });

    // circuit breaker enabled from 11 failed request
    for (let i = 0; i < 20; i++) {
      try {
        await httpClient.get('fake');
      } catch (e) {
        // do nothing
      }
    }

    const circuitBreakerErrorLogs = loggerMock.error.mock.calls.filter((args) => {
      const { meta } = args[0];
      return meta.CIRCUIT_BREAKER && meta.CIRCUIT_BREAKER.open;
    });

    // so, we will have 9 failed requests from CIRCUIT_BREAKER
    expect(circuitBreakerErrorLogs.length).toBe(9);
  });
});
/* eslint-enable import/first */
