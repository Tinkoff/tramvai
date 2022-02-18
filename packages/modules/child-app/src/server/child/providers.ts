import type { Container } from '@tinkoff/dippy';
import type { Provider } from '@tramvai/core';
import {
  CHILD_APP_INTERNAL_BEFORE_RENDER_TOKEN,
  CHILD_APP_INTERNAL_ROOT_STATE_SUBSCRIPTION_TOKEN,
} from '@tramvai/tokens-child-app';
import { STORE_TOKEN } from '@tramvai/tokens-common';

export const getChildProviders = (appDi: Container): Provider[] => {
  const store = appDi.get(STORE_TOKEN);

  return [
    {
      provide: CHILD_APP_INTERNAL_BEFORE_RENDER_TOKEN,
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

          const state = store.getState();

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
  ];
};
