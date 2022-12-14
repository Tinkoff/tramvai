import { createToken } from '@tinkoff/dippy';
import type { Cache } from '@tramvai/tokens-common';

export const PAPI_CACHE_TOKEN = createToken<Cache<number>>('app papi cache');
