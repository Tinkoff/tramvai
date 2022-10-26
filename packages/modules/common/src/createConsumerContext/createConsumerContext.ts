import type { Container, ExtractDependencyType } from '@tinkoff/dippy';
import type { DispatcherContext, Event, Reducer } from '@tramvai/state';
import { convertAction } from '@tramvai/state';
import type { Action, TramvaiAction } from '@tramvai/core';
import type {
  STORE_TOKEN,
  PUBSUB_TOKEN,
  CONTEXT_TOKEN,
  DISPATCHER_CONTEXT_TOKEN,
} from '@tramvai/tokens-common';
import { ACTION_EXECUTION_TOKEN } from '@tramvai/tokens-common';
import type { PlatformAction } from './typings';

type ContextType = typeof CONTEXT_TOKEN;

type Deps = {
  di: Container;
  dispatcherContext: ExtractDependencyType<typeof DISPATCHER_CONTEXT_TOKEN>;
  pubsub: ExtractDependencyType<typeof PUBSUB_TOKEN>;
  store: ExtractDependencyType<typeof STORE_TOKEN>;
};

export class ConsumerContext implements ContextType {
  di: Deps['di'];

  pubsub: Deps['pubsub'];

  private dispatcher: DispatcherContext<this>;

  private store: Deps['store'];

  /* Side Effects */
  executeAction = (
    action: PlatformAction<any, any> | Action<any, any, any> | TramvaiAction<any[], any, any>,
    payload?: any
  ): Promise<any> => {
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

  getState: ContextType['getState'] = (...args: any[]) => {
    return this.store.getState<any>(args[0]);
  };

  subscribe: ContextType['subscribe'] = (...args: any[]) => {
    return this.store.subscribe(args[0], args[1]);
  };

  hasStore = (store: Reducer<any>) => this.dispatcher.hasStore(store);
  registerStore = (store: Reducer<any>) => this.dispatcher.registerStore(store);
  unregisterStore = (store: Reducer<any>) => this.dispatcher.unregisterStore(store);

  constructor({ di, dispatcherContext, pubsub, store }: Deps) {
    this.store = store;
    // @ts-expect-error
    this.dispatcher = dispatcherContext;
    // TODO убрать, нужно для некоторых старых сторов на платформе
    this.dispatcher.setContext(this);
    this.di = di; // кажется этого здесь не  должно быть

    this.pubsub = pubsub;
  }
}

export function createConsumerContext({ di, dispatcherContext, pubsub, store }: Deps): ContextType {
  return new ConsumerContext({
    di,
    dispatcherContext,
    pubsub,
    store,
  });
}
