import {
  SERVER_MODULE_PAPI_PRIVATE_URL,
  SERVER_MODULE_PAPI_PUBLIC_URL,
} from '@tramvai/tokens-server';
import { APP_INFO_TOKEN } from '@tramvai/core';

export const sharedProviders = [
  {
    provide: SERVER_MODULE_PAPI_PUBLIC_URL,
    useFactory: ({ appInfo }) => {
      return `/${appInfo.appName}/papi`;
    },
    deps: {
      appInfo: APP_INFO_TOKEN,
    },
  },
  {
    provide: SERVER_MODULE_PAPI_PRIVATE_URL,
    useFactory: ({ appInfo }) => {
      return `/${appInfo.appName}/private/papi`;
    },
    deps: {
      appInfo: APP_INFO_TOKEN,
    },
  },
];
