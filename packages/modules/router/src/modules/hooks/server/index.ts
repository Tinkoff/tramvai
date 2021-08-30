import type { Provider } from '@tramvai/core';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { afterNavigateHooksToken } from '../../tokens';
import { httpStatus } from './httpStatus';

export const serverHooks: Provider[] = [
  {
    provide: afterNavigateHooksToken,
    multi: true,
    // проставляет httpStatus если задан в текущем роуте
    useFactory: httpStatus,
    deps: {
      responseManager: RESPONSE_MANAGER_TOKEN,
    },
  },
];
