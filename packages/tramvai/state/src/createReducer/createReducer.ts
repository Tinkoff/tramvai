import { createEvent } from '../createEvent/createEvent';
import type { AnyEventCreator } from '../createEvent/createEvent.h';
import type { EventHandler, Reducer } from './createReducer.h';
import { SimpleEmitter } from '../stores/SimpleEmitter';

export function createReducer<State = {}, Name extends string = string>(
  name: Name,
  initialState: State
): Reducer<State, Name> {
  const reducers: Record<string, EventHandler<any, any>> = {};

  return class ReducerStore extends SimpleEmitter {
    static storeName = name;

    private state: State;

    constructor() {
      super();
      this.state = initialState;
    }

    static handlers: Record<string, string> = {};

    static createEvents<T extends string, P>(model: { [K in T]: EventHandler<State, P> }) {
      const eventNames = Object.keys(model) as T[];
      const events: any = {};

      eventNames.forEach((eventName) => {
        const handler: EventHandler<State, P> = model[eventName];
        const eventCreator = createEvent<P>(`${eventName}`);

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
  };
}
