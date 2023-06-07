import type { EventHandlersToEventCreators } from '@tramvai/types-actions-state-context';
import { createEvent, isEventCreator } from '../createEvent/createEvent';
import type { AnyEventCreator } from '../createEvent/createEvent.h';
import type { EventHandler, Reducer } from './createReducer.h';
import { SimpleEmitter } from '../stores/SimpleEmitter';

interface Options<
  Name extends string,
  State,
  Events extends Record<string, EventHandler<State, any>>
> {
  name: Name;
  initialState: State;
  events?: Events;
}

export function createReducer<
  State,
  Name extends string,
  Events extends Record<string, EventHandler<State, any>> = Record<string, EventHandler<State, any>>
>(
  options: Options<Name, State, Events>
): Reducer<State, Name, EventHandlersToEventCreators<State, Events>>;
export function createReducer<State = {}, Name extends string = string>(
  name: Name,
  initialState: State
): Reducer<State, Name, never>;
export function createReducer<
  State = {},
  Name extends string = string,
  Events extends Record<string, EventHandler<State, any>> = {}
>(
  nameOrOptions: Name | Options<Name, State, Events>,
  initialStateArg?: State
): Reducer<State, Name> | Reducer<State, Name, EventHandlersToEventCreators<State, Events>> {
  const { name, initialState } =
    typeof nameOrOptions === 'object'
      ? nameOrOptions
      : { name: nameOrOptions, initialState: initialStateArg! };
  const reducers: Record<string, EventHandler<any, any>> = {};

  class ReducerStore extends SimpleEmitter {
    static storeName = name;

    private state: State;

    static events: any = undefined;

    constructor() {
      super();
      this.state = initialState;
    }

    static handlers: Record<string, string> = {};

    static createEvents<E extends Record<string, EventHandler<State, any>>>(
      model: E
    ): EventHandlersToEventCreators<State, E> {
      const eventNames = Object.keys(model);
      const events: any = {};

      eventNames.forEach((eventName) => {
        const handler: EventHandler<State, any> = model[eventName];
        const eventCreator = createEvent(`${this.storeName}_${eventName}`);

        events[eventName] = eventCreator;
        ReducerStore.on(eventCreator, handler);
      });

      return events;
    }

    static on<P>(
      eventOrType: AnyEventCreator<P> | string | Array<AnyEventCreator | string>,
      reducer: EventHandler<State, P>
    ) {
      if (Array.isArray(eventOrType)) {
        eventOrType.forEach((event) => ReducerStore.on(event, reducer));

        return ReducerStore;
      }

      if (isEventCreator(eventOrType) && !eventOrType.store) {
        // eslint-disable-next-line no-param-reassign
        eventOrType.store = ReducerStore as Reducer<any, any>;
      }

      const type = eventOrType.toString();

      ReducerStore.handlers[type] = 'handle';
      reducers[type] = reducer;

      return ReducerStore;
    }

    getState(): State {
      return this.state;
    }

    setState(state: State) {
      this.state = state;

      // обновление необходимо, иначе state-manager не пересчитает состояние
      this.emit('change');
    }

    dehydrate(): State {
      return this.state;
    }

    rehydrate(state: State) {
      this.state = state;
    }

    handle(payload: any, eventName: string) {
      const reducer = reducers[eventName];

      if (reducer) {
        this.state = reducer(this.state, payload);
        this.emit('change');
      }
    }
  }

  if (typeof nameOrOptions === 'object' && nameOrOptions.events) {
    ReducerStore.events = ReducerStore.createEvents(nameOrOptions.events);
  }

  return ReducerStore;
}
