import { commandLineListTokens, Scope, COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { INITIAL_APP_STATE_TOKEN } from '../tokens';

declare global {
  interface Window {
    initialState: string;
  }
}

export const providers = [
  {
    provide: INITIAL_APP_STATE_TOKEN,
    useFactory: () => JSON.parse(window.initialState || '{}'),
    scope: Scope.REQUEST,
  },
  {
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
  },
];
