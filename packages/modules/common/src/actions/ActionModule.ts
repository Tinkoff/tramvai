import { Module, Scope, ACTIONS_LIST_TOKEN, DI_TOKEN, provide } from '@tramvai/core';
import {
  LOGGER_TOKEN,
  CONTEXT_TOKEN,
  ACTION_REGISTRY_TOKEN,
  ACTION_PAGE_RUNNER_TOKEN,
  ACTION_EXECUTION_TOKEN,
  ACTION_CONDITIONALS,
  STORE_TOKEN,
  COMBINE_REDUCERS,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
  COMMAND_LINE_EXECUTION_CONTEXT_TOKEN,
} from '@tramvai/tokens-common';
import { actionTramvaiReducer } from './actionTramvaiReducer';
import { ActionExecution } from './actionExecution';
import { ActionRegistry } from './actionRegistry';
import { ActionPageRunner } from './actionPageRunner';

// conditions
import { alwaysCondition } from './conditions/always';
import { onlyServer } from './conditions/onlyServer';
import { onlyBrowser } from './conditions/onlyBrowser';
import { pageServer } from './conditions/pageServer';
import { pageBrowser } from './conditions/pageBrowser';

export { alwaysCondition, onlyServer, onlyBrowser, pageServer, pageBrowser };

@Module({
  providers: [
    {
      provide: COMBINE_REDUCERS,
      multi: true,
      useValue: actionTramvaiReducer,
    },
    {
      // Регистер глобальных экшенов
      provide: ACTION_REGISTRY_TOKEN,
      scope: Scope.SINGLETON,
      useClass: ActionRegistry,
      deps: { actionsList: ACTIONS_LIST_TOKEN },
    },
    provide({
      provide: ACTION_EXECUTION_TOKEN,
      scope: Scope.REQUEST,
      useClass: ActionExecution,
      deps: {
        actionConditionals: { token: ACTION_CONDITIONALS, optional: true },
        context: CONTEXT_TOKEN,
        store: STORE_TOKEN,
        di: DI_TOKEN,
        executionContextManager: EXECUTION_CONTEXT_MANAGER_TOKEN,
        transformAction: {
          token: 'actionTransformAction',
          optional: true,
        },
      },
    }),
    provide({
      provide: ACTION_PAGE_RUNNER_TOKEN,
      scope: Scope.REQUEST,
      useClass: ActionPageRunner,
      deps: {
        actionExecution: ACTION_EXECUTION_TOKEN,
        executionContextManager: EXECUTION_CONTEXT_MANAGER_TOKEN,
        commandLineExecutionContext: COMMAND_LINE_EXECUTION_CONTEXT_TOKEN,
        store: STORE_TOKEN,
        limitTime: 'limitActionGlobalTimeRun',
        logger: LOGGER_TOKEN,
      },
    }),
    {
      provide: 'limitActionGlobalTimeRun',
      useValue: 500,
    },
    {
      provide: ACTION_CONDITIONALS,
      multi: true,
      useValue: [alwaysCondition, onlyServer, onlyBrowser, pageServer, pageBrowser],
    },
  ],
})
class ActionModule {}

export { ActionModule };
