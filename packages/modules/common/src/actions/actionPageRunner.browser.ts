import type { Action } from '@tramvai/core';
import { ACTION_PARAMETERS } from '@tramvai/core';
import type { LOGGER_TOKEN } from '@tramvai/module-log';
import type { ActionExecution } from './actionExecution';
import { actionType } from './constants';

const payload = {};

export class ActionPageRunner {
  actionExecution: ActionExecution;

  log: ReturnType<typeof LOGGER_TOKEN>;

  constructor({
    actionExecution,
    logger,
  }: {
    actionExecution: ActionExecution;
    logger: typeof LOGGER_TOKEN;
  }) {
    this.actionExecution = actionExecution;
    this.log = logger('action:action-page-runner');
  }

  runActions(actions: Action[], stopRunAtError: (error: Error) => boolean = () => false) {
    const actionMapper = (action: Action) => {
      return Promise.resolve()
        .then(() => this.actionExecution.run(action, payload, actionType.global))
        .catch((error) => {
          const parameters = action[ACTION_PARAMETERS];

          this.log.error({
            error,
            event: `action-execution-error`,
            message: `${parameters.name} execution error`,
          });

          if (stopRunAtError(error)) {
            throw error;
          }
        });
    };

    return Promise.all(actions.map(actionMapper));
  }
}
