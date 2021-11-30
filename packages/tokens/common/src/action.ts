import { createToken } from '@tinkoff/dippy';
import type { Action } from '@tramvai/core';

/**
 * @description
 * Registry for storing actions based on their type
 */
export const ACTION_REGISTRY_TOKEN = createToken<ActionsRegistry>('actionRegistry');

/**
 * @description
 * Instance that executes actions
 */
export const ACTION_EXECUTION_TOKEN = createToken<ActionExecution>('actionExecution');

/**
 * @description
 * Instance that executes actions on navigations
 */
export const ACTION_PAGE_RUNNER_TOKEN = createToken<ActionPageRunner>('actionPageRunner');

/**
 * @description
 * Conditions that specify should action be executing or not
 */
export const ACTION_CONDITIONALS = createToken<ActionCondition[]>('actionConditionals', {
  multi: true,
});

export interface ActionsRegistry {
  add(type: string, actions: Action | Action[]): void;

  get(type: string, addingActions?: Action[]): Action[];
  getGlobal(): Action[];

  remove(type: string, actions?: Action | Action[]): void;
}

export interface ActionExecution {
  execution: Map<string, any[]>;

  run(action: Action, payload: any): Promise<any>;
}

export interface ActionPageRunner {
  runActions(actions: Action[], stopRunAtError?: (error: Error) => boolean): Promise<any>;
}

export interface ActionConditionChecker<State = any> {
  payload: any;
  parameters: any;
  conditions: Record<string, any>;
  type: 'global' | 'local';
  allow(): void;
  setState(value: State): void;
  getState(): State;
  forbid(): void;
}

export type ActionCondition = {
  key: string;
  fn: (checker: ActionConditionChecker) => void;
};
