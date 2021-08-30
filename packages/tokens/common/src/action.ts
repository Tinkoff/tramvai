import { createToken } from '@tinkoff/dippy';
import type { Action } from '@tramvai/core';

/**
 * @description
 * Регистр для хранения экшенов по типам
 */
export const ACTION_REGISTRY_TOKEN = createToken<ActionsRegistry>('actionRegistry');

/**
 * @description
 * Сущность для исполнения экшенов
 */
export const ACTION_EXECUTION_TOKEN = createToken<ActionExecution>('actionExecution');

/**
 * @description
 * Сушность для выполнения экшенов при переходах
 */
export const ACTION_PAGE_RUNNER_TOKEN = createToken<ActionPageRunner>('actionPageRunner');

/**
 * @description
 * Позволяет добавлять условия на возможность исполнения экшенов
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
