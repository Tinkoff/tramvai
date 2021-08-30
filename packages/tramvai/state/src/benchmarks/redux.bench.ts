import range from '@tinkoff/utils/array/range';
import type { Reducer } from 'redux';
import { createStore, combineReducers } from 'redux';

const generateReducer = (name: any) => {
  const actionType = `${name} update action`;

  const actionCreator = (payload: number) => ({
    type: actionType,
    payload,
  });

  const reducer: Reducer = (state = 0, action) => {
    if (action.type === actionType) {
      return action.payload;
    }
    return state;
  };

  return {
    actionCreator,
    reducer,
    name: `${name} reducer`,
  };
};

const reducersAndActions = range(0, 100).map((id) => generateReducer(id));
const reducersSlice = reducersAndActions.reduce((slice, { name, reducer }) => {
  // eslint-disable-next-line no-param-reassign
  slice[name] = reducer;
  return slice;
}, {} as Record<string, Reducer>);
const actions = reducersAndActions.map(({ actionCreator }) => actionCreator);
const store = createStore(combineReducers(reducersSlice));
let currentPayload = 1;

export const redux = {
  createReducers() {
    range(0, 100).map((id) => generateReducer(id));
  },
  createStore() {
    createStore(combineReducers(reducersSlice));
  },
  dispatchOne() {
    store.dispatch(actions[0](currentPayload++));
  },
  dispatchMany() {
    actions.forEach((action) => {
      store.dispatch(action(currentPayload++));
    });
  },
  subscriptions() {
    reducersAndActions.forEach(({ name }) => {
      let state = store.getState()[name];

      store.subscribe(() => {
        const nextState = store.getState()[name];

        if (state !== nextState) {
          state = nextState;
        }
      });
    });

    store.dispatch(actions[0](currentPayload++));
  },
};
