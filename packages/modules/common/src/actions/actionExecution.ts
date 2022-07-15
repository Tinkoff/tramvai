import flatten from '@tinkoff/utils/array/flatten';
import identity from '@tinkoff/utils/function/identity';
import type { Action, ActionParameters, DI_TOKEN } from '@tramvai/core';
import { ACTION_PARAMETERS } from '@tramvai/core';
import type { CONTEXT_TOKEN, ActionCondition, STORE_TOKEN } from '@tramvai/tokens-common';
import objectMap from '@tinkoff/utils/object/map';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import { ActionChecker } from './actionChecker';
import type { ActionType } from './constants';
import { actionType } from './constants';
import { actionTramvaiReducer } from './actionTramvaiReducer';

export const getParameters = (action: Action): ActionParameters<any, any> =>
  action[ACTION_PARAMETERS];

type ExecutionStatus = 'success' | 'failed' | 'pending' | 'forbidden';

export interface ExecutionState {
  status: ExecutionStatus;
  state: Record<string, any>;
}

type TransformAction = <T>(action: T) => T;

export class ActionExecution {
  actionConditionals: ActionCondition[];

  execution: Map<string, ExecutionState>;

  context: ExtractDependencyType<typeof CONTEXT_TOKEN>;

  di: ExtractDependencyType<typeof DI_TOKEN>;

  transformAction: TransformAction;

  constructor({
    actionConditionals,
    store,
    context,
    di,
    transformAction,
  }: {
    actionConditionals: ActionCondition[] | ActionCondition[][] | null;
    store?: ExtractDependencyType<typeof STORE_TOKEN>;
    context?: ExtractDependencyType<typeof CONTEXT_TOKEN>;
    di?: ExtractDependencyType<typeof DI_TOKEN>;
    transformAction?: TransformAction;
  }) {
    this.actionConditionals = flatten(actionConditionals ?? []);
    this.context = context;
    this.di = di;
    this.execution = new Map();
    this.transformAction = transformAction || identity;

    const initialState = store.getState(actionTramvaiReducer);

    if (initialState && initialState.serverState) {
      objectMap((value, key) => {
        this.execution.set(key, value);
      }, initialState.serverState);
    }
  }

  run(action: Action, payload: any, type: ActionType = actionType.local): Promise<any> {
    // TODO выпилить после перевода всех экшенов к виду Action
    this.transformAction(action);
    const parameters = getParameters(action);
    const executionState = this.getExecutionState(parameters);

    if (!this.canExecuteAction(payload, parameters, executionState, type)) {
      return Promise.resolve();
    }

    const deps = parameters.deps ? this.di.getOfDeps(parameters.deps) : {};

    executionState.status = 'pending';
    return Promise.resolve()
      .then(() => action(this.context, payload, deps))
      .then((data) => {
        executionState.status = 'success';
        return data;
      })
      .catch((err) => {
        executionState.status = 'failed';
        throw err;
      });
  }

  private getExecutionState(parameters: ActionParameters<any, any>) {
    let executionState = this.execution.get(parameters.name);
    if (!executionState) {
      executionState = { status: 'pending', state: {} };
      this.execution.set(parameters.name, executionState);
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
}
