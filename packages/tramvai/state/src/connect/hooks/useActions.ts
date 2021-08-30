import isArray from '@tinkoff/utils/is/array';
import { useMemo } from 'react';
import { useShallowEqual } from '@tinkoff/react-hooks';
import type { AnyAction as Action } from '@tramvai/types-actions-state-context';
import { useConsumerContext } from './useConsumerContext';

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
export function useActions(actions: Action<any, any> | Array<Action<any, any>>) {
  const context = useConsumerContext();
  const actionsRef = useShallowEqual(actions);

  return useMemo<any>(() => {
    if (isArray(actionsRef)) {
      return actionsRef.map((action: Action<any, any>) =>
        context.executeAction.bind(context, action)
      );
    }

    return context.executeAction.bind(context, actionsRef);
  }, [actionsRef, context]);
}
