import { commandLineListTokens, Scope, COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';

declare global {
  interface Window {
    initialState: any;
  }
}

export const providers = [
  {
    provide: 'initialAppState',
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
