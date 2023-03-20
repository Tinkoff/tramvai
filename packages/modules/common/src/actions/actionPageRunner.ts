import type { Action, ExtractDependencyType, TramvaiAction } from '@tramvai/core';
import { isTramvaiAction } from '@tramvai/core';
import { ACTION_PARAMETERS } from '@tramvai/core';
import type {
  LOGGER_TOKEN,
  ActionPageRunner as ActionPageRunnerInterface,
  STORE_TOKEN,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
  COMMAND_LINE_EXECUTION_CONTEXT_TOKEN,
  ACTION_EXECUTION_TOKEN,
} from '@tramvai/tokens-common';
import { isSilentError } from '@tinkoff/errors';
import { actionServerStateEvent } from './actionTramvaiReducer';
import type { ActionExecution } from './actionExecution';

declare module '@tramvai/tokens-common' {
  interface ExecutionContextValues {
    pageActions?: boolean;
  }
}

export class ActionPageRunner implements ActionPageRunnerInterface {
  private log: ReturnType<ExtractDependencyType<typeof LOGGER_TOKEN>>;

  constructor(
    private deps: {
      store: ExtractDependencyType<typeof STORE_TOKEN>;
      actionExecution: ExtractDependencyType<typeof ACTION_EXECUTION_TOKEN>;
      executionContextManager: ExtractDependencyType<typeof EXECUTION_CONTEXT_MANAGER_TOKEN>;
      commandLineExecutionContext: ExtractDependencyType<
        typeof COMMAND_LINE_EXECUTION_CONTEXT_TOKEN
      >;
      limitTime: number;
      logger: ExtractDependencyType<typeof LOGGER_TOKEN>;
    }
  ) {
    this.log = deps.logger('action:action-page-runner');
  }

  // TODO stopRunAtError нужен только для редиректов на стороне сервера в экшенах. И нужно пересмотреть реализацию редиректов
  runActions(
    actions: Array<Action | TramvaiAction<any[], any, any>>,
    stopRunAtError: (error: Error) => boolean = () => false
  ) {
    return this.deps.executionContextManager.withContext(
      this.deps.commandLineExecutionContext(),
      { name: 'pageActions', values: { pageActions: true } },
      (executionContext, abortController) => {
        return new Promise<void>((resolve, reject) => {
          const timeoutMarker = setTimeout(() => {
            this.log.warn(
              `page actions has exceeded timeout of ${this.deps.limitTime}ms, ignore some results of execution`
            );

            abortController.abort();

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            endChecker();
          }, this.deps.limitTime);

          const endChecker = () => {
            clearTimeout(timeoutMarker);
            const result: Record<string, any> = {};
            // TODO: dehydrate only actions on first level as inner actions are running on client despite their execution on server
            this.deps.actionExecution.execution.forEach((value, key) => {
              // достаем значения экшенов, которые успешно выполнились, остальные выполнятся на клиенте
              if (value.status === 'success') {
                result[key] = value;
              }
            });

            this.syncStateActions(result);
            resolve();
          };

          const actionMapper = (action: Action | TramvaiAction<any[], any, any>) => {
            return Promise.resolve()
              .then(() =>
                this.deps.actionExecution.runInContext(
                  executionContext,
                  action as TramvaiAction<any[], any, any>
                )
              )
              .catch((error) => {
                const isCriticalError = stopRunAtError(error);

                if (!isSilentError(error)) {
                  const parameters = isTramvaiAction(action) ? action : action[ACTION_PARAMETERS];

                  this.log.error({
                    error,
                    event: `action-execution-error`,
                    message: `${parameters?.name ?? 'unknown'} execution error, ${
                      isCriticalError
                        ? `${error.name} error are expected and will stop actions execution and prevent page rendering`
                        : `this action will be automatically executed on client - https://tramvai.dev/docs/features/data-fetching/action#synchronizing-between-server-and-client
If the request in this action takes too long, you can move it to the client using "onlyBrowser" condition.
Also, the necessary network accesses may not be present.`
                    }`,
                  });
                }

                if (isCriticalError) {
                  clearTimeout(timeoutMarker);
                  reject(error);
                }
              });
          };

          // eslint-disable-next-line promise/catch-or-return
          Promise.all(actions.map(actionMapper)).then(endChecker);
        });
      }
    );
  }

  private syncStateActions(success: Record<string, any>) {
    return this.deps.store.dispatch(actionServerStateEvent(success));
  }
}
