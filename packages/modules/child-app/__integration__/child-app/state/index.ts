import {
  CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN,
  createChildApp,
} from '@tramvai/child-app-core';
import { provide } from '@tramvai/core';
import { COMBINE_REDUCERS, CommonChildAppModule, CONTEXT_TOKEN } from '@tramvai/module-common';
import { StateCmp } from './component';
import { setRootState, rootStore } from './stores';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'state',
  render: StateCmp,
  modules: [CommonChildAppModule],
  providers: [
    provide({
      provide: COMBINE_REDUCERS,
      multi: true,
      useValue: [rootStore],
    }),
    provide({
      provide: CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN,
      multi: true,
      useFactory: ({ context }) => {
        return {
          stores: ['root'],
          listener: (state: Record<string, any>) => {
            return context.dispatch(setRootState(`root ${state.root.value}`));
          },
        };
      },
      deps: {
        context: CONTEXT_TOKEN,
      },
    }),
  ],
});
