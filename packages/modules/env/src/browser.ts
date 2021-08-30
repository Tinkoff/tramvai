import { Module, Scope } from '@tramvai/core';
import {
  STORE_TOKEN,
  COMBINE_REDUCERS,
  ENV_MANAGER_TOKEN,
  ENV_USED_TOKEN,
} from '@tramvai/tokens-common';

import { EnvironmentManager } from './shared/EnvironmentManager';
import { EnvironmentStore } from './shared/EnvironmentStore';

export { ENV_MANAGER_TOKEN, ENV_USED_TOKEN };

@Module({
  providers: [
    {
      provide: ENV_MANAGER_TOKEN,
      useFactory: ({ store }) => {
        const env = new EnvironmentManager();
        env.update(store.getState(EnvironmentStore));

        return env;
      },
      scope: Scope.SINGLETON,
      deps: {
        store: STORE_TOKEN,
      },
    },
    {
      provide: COMBINE_REDUCERS,
      useValue: EnvironmentStore,
      multi: true,
    },
  ],
})
export class EnvironmentModule {}
