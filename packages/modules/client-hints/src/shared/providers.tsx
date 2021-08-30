import type { Provider } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/module-common';
import { UserAgentStore } from './stores/userAgent';
import { MediaStore } from './stores/media';

export const providers: Provider[] = [
  { provide: COMBINE_REDUCERS, multi: true, useValue: [UserAgentStore, MediaStore] },
];
