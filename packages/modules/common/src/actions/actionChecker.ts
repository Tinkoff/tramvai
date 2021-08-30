import type { ActionConditionsParameters, ActionParameters } from '@tramvai/core';
import type { ActionConditionChecker, ActionCondition } from '@tramvai/tokens-common';
import type { ExecutionState } from './actionExecution';
import type { ActionType } from './constants';
import { actionType } from './constants';

export class ActionChecker implements ActionConditionChecker {
  conditions: ActionConditionsParameters;

  private status = true;

  private forbiddenMarker = false;

  private key = null;

  // eslint-disable-next-line max-params
  constructor(
    private globalConditionals: ActionCondition[],
    public payload: any,
    public parameters: ActionParameters<any, any>,
    private executionState: ExecutionState,
    public type: ActionType
  ) {
    // для глобальных экшенов мы должны дедублицировать выполнение и меньше выполнять
    if (type === actionType.global) {
      // если экшен был уже выполнен, то считаем, что его не нужно больше выполнять
      this.status = executionState.status !== 'success';
    }
    this.conditions = parameters.conditions;
  }

  check() {
    this.globalConditionals.forEach((filter) => {
      this.key = filter.key;
      filter.fn(this);
    });

    return this.getStatus();
  }

  setState(value: any) {
    this.executionState.state[this.key] = value;
  }

  getState() {
    return this.executionState.state[this.key];
  }

  forbid() {
    this.executionState.status = 'forbidden';
    this.forbiddenMarker = true;
  }

  allow() {
    this.status = true;
  }

  private getStatus(): boolean {
    if (this.forbiddenMarker) {
      return false;
    }
    return this.status;
  }
}
