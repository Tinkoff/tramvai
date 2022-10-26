import { commandLineListTokens, Scope, COMMAND_LINE_RUNNER_TOKEN, provide } from '@tramvai/core';
import { INITIAL_APP_STATE_TOKEN } from '@tramvai/tokens-common';

export const providers = [
  provide({
    provide: INITIAL_APP_STATE_TOKEN,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useFactory: () =>
      JSON.parse(document.getElementById('__TRAMVAI_STATE__')!.textContent as string),
    scope: Scope.REQUEST,
  }),
  provide({
    provide: commandLineListTokens.listen,
    useFactory: ({
      commandLineRunner,
    }: {
      commandLineRunner: typeof COMMAND_LINE_RUNNER_TOKEN;
    }) => {
      return function initClientCommand() {
        return commandLineRunner.run('client', 'customer');
      };
    },
    deps: { commandLineRunner: COMMAND_LINE_RUNNER_TOKEN },
    multi: true,
  }),
];
