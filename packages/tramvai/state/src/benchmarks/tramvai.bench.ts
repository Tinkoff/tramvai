import range from '@tinkoff/utils/array/range';
import { createReducer, createEvent, Dispatcher } from '../index';

const generateReducer = (name) => {
  const event = createEvent<number>(`${name} update event`);

  const reducer = createReducer(`${name} reducer`, 0).on(event, (state, payload) => payload);

  return {
    event,
    reducer,
  };
};

const reducersAndEvents = range(0, 100).map((id) => generateReducer(id));
const reducers = reducersAndEvents.map(({ reducer }) => reducer);
const events = reducersAndEvents.map(({ event }) => event);
const preloadedDispatcher = new Dispatcher({
  stores: reducers,
});
const preloadedDc = preloadedDispatcher.createContext({}, {});
let currentPayload = 1;

export const tramvai = {
  createReducers() {
    range(0, 100).map((id) => generateReducer(id));
  },
  createStore() {
    const dispatcher = new Dispatcher({
      stores: reducers,
    });

    dispatcher.createContext({}, {});
  },
  dispatchOne() {
    preloadedDc.dispatch(events[0](currentPayload++));
  },
  dispatchMany() {
    events.forEach((event) => {
      preloadedDc.dispatch(event(currentPayload++));
    });
  },
  subscriptions() {
    reducersAndEvents.forEach(({ reducer }) => {
      let state = preloadedDc.getState(reducer);

      preloadedDc.subscribe(reducer, () => {
        const nextState = preloadedDc.getState(reducer);

        if (state !== nextState) {
          state = nextState;
        }
      });
    });

    preloadedDc.dispatch(events[0](currentPayload++));
  },
};
