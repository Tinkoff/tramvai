import flatten from '@tinkoff/utils/array/flatten';
import type { Container } from '@tinkoff/dippy';
import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import {
  CHILD_APP_INTERNAL_ACTION_TOKEN,
  CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN,
  commandLineListTokens,
} from '@tramvai/tokens-child-app';
import { ACTION_PAGE_RUNNER_TOKEN, CONTEXT_TOKEN } from '@tramvai/tokens-common';

export const getChildProviders = (appDi: Container): Provider[] => {
  const context = appDi.get(CONTEXT_TOKEN);

  return [
    {
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory: ({
        subscriptions,
      }: {
        subscriptions: typeof CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN[];
      }) => {
        return function resolveRootStateForChild() {
          if (!subscriptions) {
            return;
          }

          const state = context.getState();

          return Promise.all(
            subscriptions.map((sub) => {
              return sub.listener(state);
            })
          );
        };
      },
      deps: {
        subscriptions: { token: CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN, optional: true },
      },
    },
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
