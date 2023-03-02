import { isSilentError } from '@tinkoff/errors';
import type { Action, TramvaiAction } from '@tramvai/core';
import { isTramvaiAction } from '@tramvai/core';
import { ACTION_PARAMETERS } from '@tramvai/core';
import type { LOGGER_TOKEN } from '@tramvai/module-log';
import type {
  COMMAND_LINE_EXECUTION_CONTEXT_TOKEN,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import type { ActionExecution } from './actionExecution';

export class ActionPageRunner {
  log: ReturnType<typeof LOGGER_TOKEN>;

  constructor(
    private deps: {
      actionExecution: ActionExecution;
      executionContextManager: typeof EXECUTION_CONTEXT_MANAGER_TOKEN;
      commandLineExecutionContext: typeof COMMAND_LINE_EXECUTION_CONTEXT_TOKEN;
      logger: typeof LOGGER_TOKEN;
    }
  ) {
    this.log = deps.logger('action:action-page-runner');
  }

  runActions(
    actions: Array<Action | TramvaiAction<any[], any, any>>,
    stopRunAtError: (error: Error) => boolean = () => false
  ) {
    return this.deps.executionContextManager.withContext(
      this.deps.commandLineExecutionContext(),
      { name: 'pageActions', values: { pageActions: true } },
      async (executionContext) => {
        const actionMapper = (action: Action | TramvaiAction<any[], any, any>) => {
          return Promise.resolve()
            .then(() => this.deps.actionExecution.runInContext(executionContext, action))
            .catch((error) => {
              if (!isSilentError(error)) {
                const parameters = isTramvaiAction(action) ? action : action[ACTION_PARAMETERS];

                this.log.error({
                  error,
                  event: `action-execution-error`,
                  message: `${parameters?.name ?? 'uknown'} execution error`,
                });
              }

              if (stopRunAtError(error)) {
                throw error;
              }
            });
        };

        await Promise.all(actions.map(actionMapper));
      }
    );
  }
}
