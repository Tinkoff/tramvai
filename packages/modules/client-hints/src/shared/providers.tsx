import { provide } from '@tramvai/core';
import type { Provider } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';

import { UserAgentStore } from './stores/userAgent';
import { MediaStore } from './stores/media';

export const commonProviders: Provider[] = [
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: [UserAgentStore, MediaStore],
  }),
];
