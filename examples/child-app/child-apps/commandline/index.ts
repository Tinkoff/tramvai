import reduceObj from '@tinkoff/utils/object/reduce';
import { commandLineListTokens, createChildApp } from '@tramvai/child-app-core';
import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { RouterChildAppModule } from '@tramvai/module-router';
import { COMBINE_REDUCERS, STORE_TOKEN } from '@tramvai/tokens-common';
import { Cmp } from './component';
import { CommandLinesStore, pushLineEvent } from './store';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'commandline',
  render: Cmp,
  modules: [CommonChildAppModule, RouterChildAppModule],
  providers: [
    provide({
      provide: COMBINE_REDUCERS,
      multi: true,
      useValue: CommandLinesStore,
    }),
    ...reduceObj(
      (acc, value, key) => {
        acc.push(
          provide({
            provide: value,
            multi: true,
            useFactory: ({ store }) => {
              return function runCommandLine() {
                return store.dispatch(pushLineEvent(key));
              };
            },
            deps: {
              store: STORE_TOKEN,
            },
          })
        );

        return acc;
      },
      [] as Provider[],
      commandLineListTokens
    ),
  ],
});
