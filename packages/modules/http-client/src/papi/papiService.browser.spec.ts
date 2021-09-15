/**
 * @jest-environment jsdom
 */

/* eslint-disable import/first */
jest.mock('node-fetch');
jest.mock('../papiClientModule', () => require('../papiClientModule.browser'));

import fetch from 'node-fetch';
import type { Provider } from '@tinkoff/dippy';
import { testModule } from '@tramvai/test-unit';
import type { ModuleType } from '@tramvai/core';
import { APP_INFO_TOKEN } from '@tramvai/core';
import { PAPI_SERVICE } from '@tramvai/tokens-http-client';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN, REQUEST_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { CommonModule, COOKIE_MANAGER_TOKEN } from '@tramvai/module-common';
import { ServerModule } from '@tramvai/module-server';
import {
  createCookieManagerMock,
  clearCookieManagerMock,
} from '@tramvai/internal-test-utils/mocks/tramvai/cookieManager';
import { WEB_USER_ID_TOKEN } from '@tramvai/module-web-user-id';
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

global.setImmediate = ((fn, ...args) => fn(...args)) as any;

const { loggerMock, loggerFactoryMock } = createLoggerMocks();
const requestManagerMock = createRequestManagerMock();
const envManagerMock = createEnvManagerMock();
const cookieManagerMock = createCookieManagerMock();

const APP_NAME = 'testApp';

const mockApiClient = ({
  providers = [],
  modules = [],
}: {
  providers?: Provider[];
  modules?: ModuleType[];
} = {}) => {
  const { di } = testModule(HttpClientModule, {
    modules: [CommonModule, ServerModule, ...modules],
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
          appName: APP_NAME,
        },
      },
      {
        provide: COOKIE_MANAGER_TOKEN,
        useValue: cookieManagerMock,
      },
      {
        provide: WEB_USER_ID_TOKEN,
        useValue: null,
      },
      ...providers,
    ],
  });

  return di.get(PAPI_SERVICE);
};

describe('PapiService, browser', () => {
  let apiClient: typeof PAPI_SERVICE;

  beforeEach(() => {
    apiClient = mockApiClient();
  });

  afterEach(() => {
    clearLoggerMocks({ loggerMock, loggerFactoryMock });
    clearRequestManagerMock(requestManagerMock);
    clearEnvManagerMock(envManagerMock);
    clearCookieManagerMock(cookieManagerMock);
    (fetch as any).mockClear();
  });

  it('pass SERVER_MODULE_PAPI_PUBLIC_URL to baseUrl', async () => {
    (fetch as any).mockReturnValueOnce(
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    await apiClient.request({ path: 'fake' });
    const url = (fetch as any).mock.calls[0][0];

    expect(url).toBe(`/${APP_NAME}/papi/fake`);
  });

  it('GET request and response snapshot', async () => {
    (fetch as any).mockReturnValueOnce(
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const response = await apiClient.request({ path: 'fake', query: { foo: 'bar' } });
    const request = (fetch as any).mock.calls[0];

    expect(request).toMatchInlineSnapshot(`
      Array [
        "/testApp/papi/fake?foo=bar",
        Object {
          "agent": undefined,
          "body": undefined,
          "credentials": "same-origin",
          "headers": Object {
            "Content-type": "application/x-www-form-urlencoded",
            "X-real-ip": undefined,
          },
          "method": "GET",
          "signal": AbortSignal {},
          "timeout": 30000,
        },
      ]
    `);

    expect(response).toMatchInlineSnapshot(`
      Object {
        "headers": Object {
          "content-type": "application/json",
        },
        "payload": "payload",
        "status": 200,
      }
    `);
  });

  it('POST request and response snapshot', async () => {
    (fetch as any).mockReturnValueOnce(
      createJsonResponse({
        resultCode: 'OK',
        payload: 'payload',
      })
    );

    const response = await apiClient.request({
      path: 'fake',
      method: 'POST',
      body: { foo: 'bar' },
    });
    const request = (fetch as any).mock.calls[0];

    expect(request).toMatchInlineSnapshot(`
      Array [
        "/testApp/papi/fake",
        Object {
          "agent": undefined,
          "body": "foo=bar",
          "credentials": "same-origin",
          "headers": Object {
            "Content-type": "application/x-www-form-urlencoded",
            "X-real-ip": undefined,
          },
          "method": "POST",
          "signal": AbortSignal {},
          "timeout": 30000,
        },
      ]
    `);

    expect(response).toMatchInlineSnapshot(`
      Object {
        "headers": Object {
          "content-type": "application/json",
        },
        "payload": "payload",
        "status": 200,
      }
    `);
  });

  it('invalid responses', async () => {
    (fetch as any).mockReturnValueOnce(
      createJsonResponse({
        payload: 'payload',
      })
    );
    (fetch as any).mockReturnValueOnce(
      createJsonResponse({
        resultCode: 'OK',
      })
    );
    (fetch as any).mockReturnValueOnce(
      createJsonResponse({
        error: {
          message: 'Server error',
        },
      })
    );

    let firstError;
    let secondError;
    let thirdError;

    try {
      await apiClient.request({ path: 'fake' });
    } catch (e) {
      firstError = e;
    }
    try {
      await apiClient.request({ path: 'fake' });
    } catch (e) {
      secondError = e;
    }
    try {
      await apiClient.request({ path: 'fake' });
    } catch (e) {
      thirdError = e;
    }

    expect(firstError.message).toMatchInlineSnapshot(
      `"Что-то пошло не так. Мы уже решаем проблему. Попробуйте снова через несколько минут."`
    );
    expect(firstError.url).toMatchInlineSnapshot(`"/testApp/papi/fake"`);
    expect(firstError.originalMessage).toMatchInlineSnapshot(`"{\\"payload\\":\\"payload\\"}"`);

    expect(secondError.message).toMatchInlineSnapshot(
      `"Что-то пошло не так. Мы уже решаем проблему. Попробуйте снова через несколько минут."`
    );
    expect(secondError.url).toMatchInlineSnapshot(`"/testApp/papi/fake"`);
    expect(secondError.originalMessage).toMatchInlineSnapshot(`"{\\"resultCode\\":\\"OK\\"}"`);

    expect(thirdError.message).toMatchInlineSnapshot(
      `"Что-то пошло не так. Мы уже решаем проблему. Попробуйте снова через несколько минут."`
    );
    expect(thirdError.url).toMatchInlineSnapshot(`"/testApp/papi/fake"`);
    expect(thirdError.originalMessage).toMatchInlineSnapshot(`"Server error"`);
  });
});
/* eslint-enable import/first */
