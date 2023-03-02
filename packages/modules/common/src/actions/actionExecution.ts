import type { AbortController, AbortSignal } from 'node-abort-controller';
import flatten from '@tinkoff/utils/array/flatten';
import identity from '@tinkoff/utils/function/identity';
import type { Action, ActionParameters, DI_TOKEN } from '@tramvai/core';
import { isTramvaiAction } from '@tramvai/core';
import { ACTION_PARAMETERS } from '@tramvai/core';
import type {
  CONTEXT_TOKEN,
  ActionCondition,
  STORE_TOKEN,
  ActionExecution as Interface,
  EXECUTION_CONTEXT_MANAGER_TOKEN,
  ExecutionContext,
} from '@tramvai/tokens-common';
import objectMap from '@tinkoff/utils/object/map';
import type { TramvaiAction, TramvaiActionContext } from '@tramvai/types-actions-state-context';
import { ConditionFailError } from '@tinkoff/errors';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import { ActionChecker } from './actionChecker';
import type { ActionType } from './constants';
import { actionType } from './constants';
import { actionTramvaiReducer } from './actionTramvaiReducer';

const EMPTY_DEPS = {};
const DEFAULT_PAYLOAD = {};

export const getParameters = (action: Action): ActionParameters<any, any> =>
  action[ACTION_PARAMETERS];

type ExecutionStatus = 'success' | 'failed' | 'pending' | 'forbidden';

export interface ExecutionState {
  status: ExecutionStatus;
  forbiddenBy?: string;
  state: Record<string, any>;
}

type TransformAction = <T>(action: T) => T;

type AnyActionParameters = ActionParameters<any, any> | TramvaiAction<any, any, any>;

export class ActionExecution implements Interface {
  execution: Map<string, ExecutionState>;
  private actionConditionals: ActionCondition[];

  private context: ExtractDependencyType<typeof CONTEXT_TOKEN>;
  private store: ExtractDependencyType<typeof STORE_TOKEN>;
  private executionContextManager: ExtractDependencyType<typeof EXECUTION_CONTEXT_MANAGER_TOKEN>;

  private di: ExtractDependencyType<typeof DI_TOKEN>;

  private transformAction: TransformAction;

  constructor({
    store,
    context,
    di,
    executionContextManager,
    actionConditionals,
    transformAction,
  }: {
    actionConditionals: (ActionCondition | ActionCondition[])[] | null;
    store: ExtractDependencyType<typeof STORE_TOKEN>;
    context: ExtractDependencyType<typeof CONTEXT_TOKEN>;
    di: ExtractDependencyType<typeof DI_TOKEN>;
    executionContextManager: ExtractDependencyType<typeof EXECUTION_CONTEXT_MANAGER_TOKEN>;
    transformAction?: TransformAction;
  }) {
    this.actionConditionals = flatten(actionConditionals ?? []);
    this.context = context;
    this.store = store;
    this.di = di;
    this.executionContextManager = executionContextManager;
    this.execution = new Map();
    this.transformAction = transformAction || identity;

    const initialState = store.getState(actionTramvaiReducer);

    if (initialState && initialState.serverState) {
      objectMap((value, key) => {
        this.execution.set(key, value);
      }, initialState.serverState);
    }
  }

  async runInContext(
    executionContext: ExecutionContext | null,
    action: Action | TramvaiAction<any, any, any>,
    ...params: any[]
  ): Promise<any> {
    let parameters: AnyActionParameters;
    const payload = params[0] ?? DEFAULT_PAYLOAD;
    // TODO: replace type with pure context usage
    const type =
      executionContext?.values.pageActions === true ? actionType.global : actionType.local;

    // TODO: remove else branch after migration to new declareAction
    if (isTramvaiAction(action)) {
      parameters = action;
    } else {
      this.transformAction(action);
      parameters = getParameters(action);
    }

    if (!parameters) {
      throw new Error(
        'Cannot resolve internal data for action. Make sure you are using the result of `declareAction` call as an action'
      );
    }

    const executionState = this.getExecutionState(parameters.name);

    if (!this.canExecuteAction(payload, parameters, executionState, type)) {
      switch (parameters.conditionsFailResult) {
        case 'reject':
          return Promise.reject(
            new ConditionFailError({
              conditionName: executionState.forbiddenBy ?? 'unknown',
              targetName: parameters.name,
            })
          );
        default:
          return Promise.resolve();
      }
    }

    executionState.status = 'pending';

    return this.executionContextManager.withContext(
      executionContext,
      {
        name: parameters.name,
        values: executionContext?.values.pageActions === true ? { pageActions: false } : undefined,
      },
      (executionActionContext, abortController) => {
        const context = this.createActionContext(
          executionContext,
          executionActionContext,
          abortController,
          parameters
        );

        return Promise.resolve()
          .then(() => {
            if (isTramvaiAction(action)) {
              return action.fn.apply(context, params);
            }

            return action(this.context, payload, context.deps);
          })
          .then((data) => {
            executionState.status = 'success';
            return data;
          })
          .catch((err) => {
            executionState.status = 'failed';
            throw err;
          });
      }
    );
  }

  async run(action: Action | TramvaiAction<any, any, any>, ...params: any[]): Promise<any> {
    return this.runInContext(null, action, ...params);
  }

  private getExecutionState(name: string) {
    let executionState = this.execution.get(name);
    // TODO: probably do not need to create executionState on client as it is not used
    if (!executionState) {
      executionState = { status: 'pending', state: {} };
      this.execution.set(name, executionState);
    }
    return executionState;
  }

  private canExecuteAction(
    payload: any,
    parameters: ActionParameters<any, any>,
    executionState: ExecutionState,
    type: ActionType
  ) {
    const actionChecker = new ActionChecker(
      this.actionConditionals,
      payload,
      parameters,
      executionState,
      type
    );

    return actionChecker.check();
  }

  private createActionContext(
    parentExecutionContext: ExecutionContext | null,
    actionExecutionContext: ExecutionContext,
    abortController: AbortController,
    parameters: AnyActionParameters
  ): TramvaiActionContext<any> {
    return {
      abortController,
      abortSignal: actionExecutionContext?.abortSignal,
      executeAction: this.runInContext.bind(this, actionExecutionContext),
      deps: parameters.deps ? this.di.getOfDeps(parameters.deps) : EMPTY_DEPS,
      actionType: parentExecutionContext?.values.pageActions ? 'page' : 'standalone',
      dispatch: this.store.dispatch,
      getState: this.store.getState,
    };
  }
}
