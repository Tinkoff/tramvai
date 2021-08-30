import { Module, Scope, commandLineListTokens, provide } from '@tramvai/core';
import flatten from '@tinkoff/utils/array/flatten';
import {
  CONTEXT_TOKEN,
  COMBINE_REDUCERS,
  ENV_MANAGER_TOKEN,
  ENV_USED_TOKEN,
} from '@tramvai/tokens-common';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { createPapiMethod } from '@tramvai/papi';

import { EnvironmentStore } from './shared/EnvironmentStore';
import { EnvironmentManagerServer } from './server/EnvironmentManagerServer';

export { ENV_MANAGER_TOKEN, ENV_USED_TOKEN };

@Module({
  providers: [
    provide({
      provide: ENV_MANAGER_TOKEN,
      useFactory: ({ tokens }) => {
        return new EnvironmentManagerServer(flatten(tokens));
      },
      deps: {
        tokens: {
          token: ENV_USED_TOKEN,
          optional: true,
        },
      },
      scope: Scope.SINGLETON,
    }),
    provide({
      provide: COMBINE_REDUCERS,
      useValue: EnvironmentStore,
      multi: true,
    }),
    provide({
      provide: commandLineListTokens.customerStart,
      useFactory: ({ context, environmentManager }) => {
        return function envCommand() {
          context.getStore('environment').setState(environmentManager.clientUsed());
        };
      },
      multi: true,
      deps: {
        environmentManager: ENV_MANAGER_TOKEN,
        context: CONTEXT_TOKEN,
      },
    }),
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useFactory: ({ environmentManager }: { environmentManager: typeof ENV_MANAGER_TOKEN }) => {
        return createPapiMethod({
          method: 'get',
          path: '/apiList',
          async handler() {
            return environmentManager.clientUsed();
          },
        });
      },
      deps: {
        environmentManager: ENV_MANAGER_TOKEN,
      },
    }),
  ],
})
export class EnvironmentModule {}
