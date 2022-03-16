import isEmpty from '@tinkoff/utils/is/empty';
import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { REQUEST } from '@tramvai/tokens-common';
import { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import {
  RESPONSE_CACHE_GET_CACHE_KEY,
  RESPONSE_CACHE_OPTIONS,
  RESPONSE_CACHE_SHOULD_SET_TO_CACHE,
  RESPONSE_CACHE_SHOULD_USE_CACHE,
} from './tokens';

export const defaultSettingsProviders: Provider[] = [
  provide({
    provide: RESPONSE_CACHE_OPTIONS,
    useValue: {
      ttl: 1000 * 60,
      maxSize: 50,
    },
  }),
  provide({
    provide: RESPONSE_CACHE_GET_CACHE_KEY,
    useFactory: ({ userAgent, request }) => {
      return () => {
        const deviceType = userAgent.mobileOS ? 'mobile' : 'desktop';

        return `${request.method}_${request.path}_${deviceType}`;
      };
    },
    deps: {
      userAgent: USER_AGENT_TOKEN,
      request: REQUEST,
    },
  }),
  provide({
    provide: RESPONSE_CACHE_SHOULD_USE_CACHE,
    useValue: () => true,
  }),
  provide({
    provide: RESPONSE_CACHE_SHOULD_SET_TO_CACHE,
    useFactory: ({ request }) => () => {
      // use cookies from raw request instead of CookieManager to ignore any cookies that were set during request handling
      return isEmpty(request.cookies);
    },
    deps: {
      request: REQUEST,
    },
  }),
];
