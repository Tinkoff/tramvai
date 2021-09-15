import type { Provider } from '@tinkoff/dippy';
import { testModule } from '@tramvai/test-unit';
import type { ModuleType } from '@tramvai/core';
import { APP_INFO_TOKEN } from '@tramvai/core';
import { PAPI_SERVICE } from '@tramvai/tokens-http-client';
import { ENV_MANAGER_TOKEN, LOGGER_TOKEN, REQUEST_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { CommonModule, COOKIE_MANAGER_TOKEN } from '@tramvai/module-common';
import { ServerModule, SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/module-server';
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
import { createPapiMethod } from '../../../../tramvai/papi/src/createPapiMethod';
import { HttpClientModule } from '../httpClientModule';

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

describe('PapiService, server', () => {
  let apiClient: typeof PAPI_SERVICE;

  beforeEach(() => {
    apiClient = mockApiClient();
  });

  afterEach(() => {
    clearLoggerMocks({ loggerMock, loggerFactoryMock });
    clearRequestManagerMock(requestManagerMock);
    clearEnvManagerMock(envManagerMock);
    clearCookieManagerMock(cookieManagerMock);
  });

  it('GET request', async () => {
    apiClient = mockApiClient({
      providers: [
        {
          provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
          multi: true,
          useValue: createPapiMethod({
            path: '/fake',
            async handler() {
              return {
                resultCode: 'OK',
                payload: 'payload',
              };
            },
          }),
        },
      ],
    });

    const { payload } = await apiClient.request({ path: 'fake' });

    expect(payload).toEqual({
      resultCode: 'OK',
      payload: 'payload',
    });
  });

  it('POST request', async () => {
    apiClient = mockApiClient({
      providers: [
        {
          provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
          multi: true,
          useValue: createPapiMethod({
            path: '/fake',
            method: 'post',
            async handler() {
              return {
                resultCode: 'OK',
                payload: 'payload',
              };
            },
          }),
        },
      ],
    });

    const { payload } = await apiClient.request({ path: 'fake', method: 'POST' });

    expect(payload).toEqual({
      resultCode: 'OK',
      payload: 'payload',
    });
  });
});
