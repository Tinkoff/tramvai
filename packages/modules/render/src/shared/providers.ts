import { provide } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';
import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';
import { PageErrorStore } from '@tramvai/module-router';

export const providers = [
  provide({
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: PageErrorStore,
  }),
  provide({
    provide: TRAMVAI_RENDER_MODE,
    useValue: 'ssr',
  }),
];
