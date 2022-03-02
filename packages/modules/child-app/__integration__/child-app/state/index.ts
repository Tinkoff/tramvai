import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN } from '@tramvai/tokens-child-app/lib';
import { StateCmp } from './component';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'state',
  render: StateCmp,
  modules: [CommonChildAppModule],
  providers: [
    {
      provide: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
      multi: true,
      useValue: ['root'],
    },
  ],
});
