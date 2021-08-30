import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { ConsumerContext } from './state';

export type ActionContext = ConsumerContext;

export type ActionConditionsParameters = {
  requiredCoreRoles?: string[];
  onlyBrowser?: boolean;
  onlyServer?: boolean;
  pageBrowser?: boolean;
  pageServer?: boolean;
  always?: boolean;
  never?: boolean;
  [key: string]: any;
};

export interface ActionParameters<Payload, Result, Deps = {}> {
  /* Название экшена. Должно быть уникальное значение */
  name: string;
  /* Функция экшена */
  fn: (context: ActionContext, payload: Payload, deps: ProvideDepsIterator<Deps>) => Result;
  /* Зависимости экшена от DI */
  deps?: Deps;
  /* Ограничения для исполнения. К примеру: авторизован ли пользователь */
  conditions?: ActionConditionsParameters;
}

export const ACTION_PARAMETERS = '__action_parameters__';

export type Action<Payload = any, Result = any, Deps = any> = ActionParameters<
  Payload,
  Result,
  Deps
>['fn'] & { [ACTION_PARAMETERS]: ActionParameters<Payload, Result, Deps> };

/**
 * @deprecated
 */
export interface PlatformAction<
  Payload extends any = any,
  Result = any,
  Context extends ActionContext = ActionContext
> {
  (context: Context, payload?: Payload): Promise<Result>;
  priority?: 3 | 5 | 7 | 10;
  name?: string;
  cancelable?: boolean;
  requiredRoles?: boolean;
  cancelOnUrlChange?: boolean;
}

export type UnknownAction<Result = any> = (...args: any[]) => Result;

export type AnyAction<Payload = any, Result = any, Deps = any> =
  | Action<Payload, Result, Deps>
  | PlatformAction<Payload, Result>
  | UnknownAction;
