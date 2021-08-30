import type { Container } from '@tinkoff/dippy';
import type { DispatcherContext, Event, Reducer } from '@tramvai/state';
import { convertAction } from '@tramvai/state';
import type { Action } from '@tramvai/core';
import type { STORE_TOKEN, PUBSUB_TOKEN, CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { ACTION_EXECUTION_TOKEN } from '@tramvai/tokens-common';
import type { PlatformAction } from './typings';

type ContextType = typeof CONTEXT_TOKEN;

export class ConsumerContext implements ContextType {
  di: Container;

  pubsub: typeof PUBSUB_TOKEN;

  private dispatcher: DispatcherContext<this>;

  private store: typeof STORE_TOKEN;

  /* Side Effects */
  executeAction = <Payload extends any = any, Result = any, Deps extends Record<string, any> = any>(
    action: PlatformAction<Payload, Result> | Action<Payload, Result, Deps>,
    payload?: Payload
  ): Promise<Result extends PromiseLike<infer U> ? U : Result> => {
    return this.di.get(ACTION_EXECUTION_TOKEN).run(action as any, payload) as any;
  };

  /* State manager */
  dispatch = <Payload>(
    actionOrNameEvent: string | Event<Payload>,
    payload?: Payload
  ): Promise<Payload> => {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.store.dispatch(convertAction(actionOrNameEvent, payload)));
      } catch (err) {
        reject(err);
      }
    });
  };

  dispatchWith = (createActionOrType: (...args: unknown[]) => Event | Event, options?: any) => {
    return typeof createActionOrType === 'function'
      ? (...args: unknown[]) => this.dispatch(createActionOrType(...args), options)
      : (payload: any) => this.dispatch(createActionOrType, payload);
  };

  /**
   * @deprecated
   */
  getStore: ContextType['getStore'] = (store) => {
    return this.dispatcher.getStore(store as any);
  };

  dehydrate = () => ({
    dispatcher: this.dispatcher.dehydrate(),
  });

  getState: ContextType['getState'] = (reducer?) => {
    return this.store.getState(reducer);
  };

  subscribe: ContextType['subscribe'] = (...args) => {
    return this.store.subscribe(args[0], args[1]);
  };

  hasStore = (store: Reducer<any>) => this.dispatcher.hasStore(store);
  registerStore = (store: Reducer<any>) => this.dispatcher.registerStore(store);
  unregisterStore = (store: Reducer<any>) => this.dispatcher.unregisterStore(store);

  constructor({ di, dispatcherContext, pubsub, store }) {
    this.store = store;
    this.dispatcher = dispatcherContext;
    // TODO убрать, нужно для некоторых старых сторов на платформе
    this.dispatcher.setContext(this);
    this.di = di; // кажется этого здесь не  должно быть

    this.pubsub = pubsub;
  }
}

export function createConsumerContext({ di, dispatcherContext, pubsub, store }) {
  return new ConsumerContext({
    di,
    dispatcherContext,
    pubsub,
    store,
  });
}
