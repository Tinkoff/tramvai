import flatten from '@tinkoff/utils/array/flatten';
import type { Container } from '@tinkoff/dippy';
import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { CHILD_APP_INTERNAL_ACTION_TOKEN, commandLineListTokens } from '@tramvai/tokens-child-app';
import { ACTION_PAGE_RUNNER_TOKEN } from '@tramvai/tokens-common';

export const getChildProviders = (appDi: Container): Provider[] => {
  return [
    provide({
      provide: commandLineListTokens.resolvePageDeps,
      multi: true,
      useFactory: ({ actionRunner, actions }) => {
        return function childAppRunActions() {
          return actionRunner.runActions(flatten(actions));
        };
      },
      deps: {
        actionRunner: ACTION_PAGE_RUNNER_TOKEN,
        actions: CHILD_APP_INTERNAL_ACTION_TOKEN,
      },
    }),
  ];
};
