import type { Action } from '@tramvai/core';
import { ACTION_PARAMETERS } from '@tramvai/core';
import type {
  LOGGER_TOKEN,
  ActionPageRunner as ActionPageRunnerInterface,
  STORE_TOKEN,
} from '@tramvai/tokens-common';
import { actionServerStateEvent } from './actionTramvaiReducer';
import type { ActionExecution } from './actionExecution';
import { actionType } from './constants';

const payload = {};

export class ActionPageRunner implements ActionPageRunnerInterface {
  store: typeof STORE_TOKEN;

  actionExecution: ActionExecution;

  private limitTime: number;

  private log: ReturnType<typeof LOGGER_TOKEN>;

  constructor({ store, actionExecution, limitTime, logger }) {
    this.store = store;
    this.actionExecution = actionExecution;
    this.limitTime = limitTime;
    this.log = logger('action:action-page-runner');
  }

  // TODO stopRunAtError нужен только для редиректов на стороне сервера в экшенах. И нужно пересмотреть реализацию редиректов
  runActions(actions: Action[], stopRunAtError: (error: Error) => boolean = () => false) {
    return new Promise<void>((resolve, reject) => {
      const timeoutMarker = setTimeout(() => {
        this.log.warn(
          `page actions has exceeded timeout of ${this.limitTime}ms, ignore some results of execution`
        );
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        endChecker();
      }, this.limitTime);

      const endChecker = () => {
        clearTimeout(timeoutMarker);
        const result: Record<string, any> = {};
        this.actionExecution.execution.forEach((value, key) => {
          // достаем значения экшенов, которые успешно выполнились, остальные выполнятся на клиенте
          if (value.status === 'success') {
            result[key] = value;
          }
        });

        this.syncStateActions(result);
        resolve();
      };

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
              clearTimeout(timeoutMarker);
              reject(error);
            }
          });
      };

      // eslint-disable-next-line promise/catch-or-return
      Promise.all(actions.map(actionMapper)).then(endChecker);
    });
  }

  private syncStateActions(success: Record<string, any>) {
    return this.store.dispatch(actionServerStateEvent(success));
  }
}
