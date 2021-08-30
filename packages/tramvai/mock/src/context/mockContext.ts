import type { ActionCondition, PlatformAction } from '@tramvai/module-common';
import {
  createConsumerContext,
  ActionExecution,
  ACTION_EXECUTION_TOKEN,
} from '@tramvai/module-common';
import type { Event, StoreClass } from '@tramvai/state';
import { createDispatcher, Reducer } from '@tramvai/state';
import type { Container } from '@tinkoff/dippy';
import { createContainer } from '@tinkoff/dippy';
import { PubSub } from '@tinkoff/pubsub';
import type { Action } from '@tramvai/core';

type Dispatch = <Payload>(action: Event<Payload> | string, payload?: Payload) => Payload;

type ExecuteAction = <
  Payload extends any = any,
  Result = any,
  Deps extends Record<string, any> = any
>(
  action: PlatformAction<Payload, Result> | Action<Payload, Result, Deps>,
  payload?: Payload
) => Promise<Result extends PromiseLike<infer U> ? U : Result>;

type Deps = {
  initialState?: any;
  di?: Container;
  request?: Record<string, any>;
  response?: Record<string, any>;
  actionConditionals?: ActionCondition[];
  stores?: StoreClass[];
  mocks?: {
    dispatchMock?: <DispatchMock extends Dispatch>(dispatch: Dispatch) => DispatchMock;
    executeActionMock?: <ExecuteActionMock extends ExecuteAction>(
      executeAction: ExecuteAction
    ) => ExecuteActionMock;
  };
};

/**
 * @deprecated используйте `createMockContext` из `@tramvai/test-mocks`
 */
export const createMockContext = ({
  initialState = {},
  di = createContainer(),
  actionConditionals = [],
  stores = [],
  mocks = {},
}: Deps = {}) => {
  let actionExecution: ActionExecution;
  const dispatcherContext = createDispatcher({ stores }).createContext<any>(null, {
    stores: initialState,
  });

  const pubsub = new PubSub();

  const store = {
    getState: (reducer?: any) => dispatcherContext.getState<any>(reducer),
    dispatch: mocks.dispatchMock
      ? mocks.dispatchMock(dispatcherContext.dispatch.bind(dispatcherContext))
      : dispatcherContext.dispatch.bind(dispatcherContext),
    subscribe: (...args: any[]) => {
      return dispatcherContext.subscribe(args[0], args[1]);
    },
  };

  if (di && !di.get({ token: ACTION_EXECUTION_TOKEN, optional: true })) {
    di.register({
      provide: ACTION_EXECUTION_TOKEN,
      useFactory: () => actionExecution,
    });
  }

  // @ts-ignore
  const context = createConsumerContext({
    di,
    pubsub,
    dispatcherContext,
    store,
  });
  const executeActionMock = mocks.executeActionMock
    ? mocks.executeActionMock(context.executeAction as ExecuteAction)
    : context.executeAction;

  context.executeAction = executeActionMock;

  actionExecution = new ActionExecution({
    actionConditionals,
    store,
    // @ts-ignore
    context,
    di,
  });

  return {
    context,
    store,
  };
};
