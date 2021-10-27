import { createReducer, createEvent } from '@tramvai/state';
import { createMockStore } from './store';

describe('test/unit/mocks/store', () => {
  it('should create empty store', () => {
    const store = createMockStore();
    const spyGetState = jest.spyOn(store, 'getState');

    expect(store.getState()).toEqual({});
    expect(spyGetState).toHaveBeenCalled();
  });

  it('should update stores with dispatch', () => {
    const event = createEvent<string>('testEvent');
    const reducer = createReducer('test', { a: 'test' }).on(event, (_, data) => {
      return {
        a: data,
      };
    });
    const store = createMockStore({ stores: [reducer] });

    expect(store.getState()).toEqual({ test: { a: 'test' } });

    store.dispatch(event('dispatched'));

    expect(store.getState()).toEqual({ test: { a: 'dispatched' } });
  });

  it('should create store by initialState', () => {
    const initialState = { a: 1, b: 2 };
    const reducerA = createReducer('a', {});
    const reducerB = createReducer('b', {});
    const store = createMockStore({ stores: [reducerA, reducerB], initialState });

    expect(store.getState()).toEqual(initialState);
  });

  it('should create fake reducer stores for every key in initialState', () => {
    const initialState = { a: 1, b: 2 };
    const reducerC = createReducer('c', 3);
    const store = createMockStore({ stores: [reducerC], initialState });

    expect(store.getState()).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});
