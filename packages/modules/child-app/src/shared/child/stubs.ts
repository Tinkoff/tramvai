import { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { CONTEXT_TOKEN, DISPATCHER_TOKEN, STORE_TOKEN } from '@tramvai/tokens-common';

export const commonModuleStubs = [
  DISPATCHER_TOKEN,
  STORE_TOKEN,
  CONTEXT_TOKEN,
  COMMAND_LINE_RUNNER_TOKEN,
].map((provide) => {
  return {
    provide,
    useFactory: () => {
      throw Object.assign(
        new Error(
          'Pure usage of the token is not allowed inside ChildApp, please add `CommonChildAppModule` from module `@tramvai/module-common` to your ChildApp'
        ),
        { code: 'E_STUB' }
      );
    },
  };
});
