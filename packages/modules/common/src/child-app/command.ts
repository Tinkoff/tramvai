import type { Provider } from '@tramvai/core';
import { COMMAND_LINES_TOKEN, Scope } from '@tramvai/core';
import { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { provide } from '@tramvai/core';
import {
  CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN,
  commandLineListTokens,
} from '@tramvai/tokens-child-app';

const command = {
  customer: [
    commandLineListTokens.customerStart,
    commandLineListTokens.resolveUserDeps,
    commandLineListTokens.resolvePageDeps,
  ],
  clear: [commandLineListTokens.clear],
  spa: [
    commandLineListTokens.resolveUserDeps,
    commandLineListTokens.resolvePageDeps,
    commandLineListTokens.spaTransition,
  ],
};

export const lines = {
  server: command,
  client: command,
};

export const commandProviders: Provider[] = [
  provide({
    provide: CHILD_APP_INTERNAL_ROOT_DI_BORROW_TOKEN,
    multi: true,
    useValue: COMMAND_LINE_RUNNER_TOKEN,
  }),
  provide({
    provide: COMMAND_LINES_TOKEN,
    scope: Scope.SINGLETON,
    useValue: lines,
  }),
];
