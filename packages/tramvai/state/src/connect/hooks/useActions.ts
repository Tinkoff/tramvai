import isArray from '@tinkoff/utils/is/array';
import { useMemo } from 'react';
import { useShallowEqual } from '@tinkoff/react-hooks';
import type { Action, TramvaiAction } from '@tramvai/types-actions-state-context';
import { useConsumerContext } from './useConsumerContext';

export function useActions<P extends any[], R, Deps = any>(
  action: TramvaiAction<P, R, Deps>
): (...args: P) => Promise<R extends Promise<infer U> ? U : R>;
export function useActions<A extends TramvaiAction<any, any, any>[]>(
  actions: A
): {
  [key in keyof A]: (...args: any[]) => Promise<any>;
};
export function useActions<A extends Readonly<TramvaiAction<any, any, any>[]>>(
  actions: A
): {
  [Key in keyof A]: A[Key] extends TramvaiAction<infer P, infer R, any>
    ? (...args: P) => Promise<R extends Promise<infer U> ? U : R>
    : never;
};
export function useActions<P, R>(
  action: Action<P, R>
): (payload?: P) => Promise<R extends PromiseLike<infer U> ? U : R>;
export function useActions<A extends Action<any, any>[]>(
  actions: A
): {
  [key in keyof A]: (payload?: any) => Promise<any>;
};
export function useActions<A extends Readonly<Action<any, any>[]>>(
  actions: A
): {
  [Key in keyof A]: A[Key] extends Action<infer P, infer R>
    ? (payload?: P) => Promise<R extends PromiseLike<infer U> ? U : R>
    : never;
};
export function useActions(
  actions:
    | Action<any, any>
    | TramvaiAction<any, any, any>
    | Array<Action<any, any>>
    | Array<TramvaiAction<any, any, any>>
) {
  const context = useConsumerContext();
  const actionsRef = useShallowEqual(actions);

  return useMemo<any>(() => {
    if (isArray(actionsRef)) {
      return actionsRef.map((action: Action<any, any> | TramvaiAction<any, any, any>) =>
        context.executeAction.bind(context, action as any)
      );
    }

    return context.executeAction.bind(context, actionsRef as any);
  }, [actionsRef, context]);
}
