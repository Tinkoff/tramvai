import type { ProvideDepsIterator } from '@tinkoff/dippy';
import type { ConsumerContext, Dispatch, GetState } from './state';

export type ActionContext = ConsumerContext;

export type ActionConditionsParameters = {
  requiredCoreRoles?: string[];
  requiredRoles?: string[];
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
  conditionsFailResult?: 'reject' | 'empty';
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

export type TramvaiActionType = 'page' | 'standalone';

export interface TramvaiActionContext<CurrentDeps> {
  abortController: AbortController;
  abortSignal: AbortSignal;
  executeAction<Params extends any[], Result, Deps>(
    action: TramvaiAction<Params, Result, Deps>,
    ...params: Params
  ): Result extends Promise<any> ? Result : Promise<Result>;

  executeAction<Payload, Result, Deps>(
    action: Action<Payload, Result, Deps>,
    payload?: Payload
  ): Result extends Promise<any> ? Result : Promise<Result>;
  deps: ProvideDepsIterator<CurrentDeps>;
  actionType: TramvaiActionType;
  dispatch: Dispatch;
  getState: GetState;
}

export interface TramvaiActionDefinition<Params extends any[], Result, Deps> {
  // TODO: maybe generate name automatically?
  name: string;
  fn: (this: TramvaiActionContext<Deps>, ...params: Params) => Result;
  deps?: Deps;
  conditions?: ActionConditionsParameters;
  conditionsFailResult?: 'reject' | 'empty';
}

export interface TramvaiAction<Params extends any[], Result, Deps>
  extends TramvaiActionDefinition<Params, Result, Deps> {
  tramvaiActionVersion: number;
}

export type UnknownAction<Result = any> = (...args: any[]) => Result;

export type AnyAction<Payload = any, Result = any, Deps = any> =
  | Action<Payload, Result, Deps>
  | PlatformAction<Payload, Result>
  | UnknownAction;

export type PageAction = Action<void, void, any> | TramvaiAction<[], void, any>;
