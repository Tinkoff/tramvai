import { createReducer } from './createReducer';
import { createEvent } from '../createEvent/createEvent';

describe('args initializer', () => {
  it('should initialize initial state', () => {
    const initialState = { a: 1, b: 2 };

    const StoreClass = createReducer('test', initialState);
    const store = new StoreClass();

    expect((StoreClass as any).storeName).toBe('test');
    expect(store.getState()).toBe(initialState);
  });

  it('store methods should work', () => {
    const initialState = 123;

    const StoreClass = createReducer('test', initialState);
    const store = new StoreClass();

    expect(store.getState()).toBe(initialState);
    expect(store.dehydrate()).toBe(initialState);

    store.rehydrate(456);
    expect(store.getState()).toBe(456);
  });

  it('call reducers on events', () => {
    const action1 = createEvent('test');
    const action2 = createEvent('test2');
    const reducer1 = jest.fn((state) => ({ ...state, a: 1, b: 5 }));
    const reducer2 = jest.fn((state) => ({ ...state, b: 3, c: 4 }));
    const payload = { c: 5 };

    const StoreClass = createReducer('test', {}).on(action1, reducer1);

    StoreClass.on(action2, reducer2);

    const store = new StoreClass();

    store.handle(payload, 'test');
    expect(reducer1).toHaveBeenCalledWith({}, payload);
    expect(store.getState()).toEqual({ a: 1, b: 5 });

    store.handle(payload, 'test2');
    expect(reducer2).toHaveBeenCalledWith({ a: 1, b: 5 }, payload);
    expect(store.getState()).toEqual({ a: 1, b: 3, c: 4 });

    expect((StoreClass as any).handlers).toEqual({
      test: 'handle',
      test2: 'handle',
    });
  });

  it('many events with createEvents', () => {
    const reducer = createReducer({
      name: 'countStore',
      initialState: 0,
      events: {
        add: (state, payload: number) => state + payload,
        decrease: (state, payload: number) => state - payload,
      },
    });

    const { events } = reducer;

    expect(typeof events.add).toBe('function');
    expect(typeof events.decrease).toBe('function');

    expect(events.add(10)).toMatchObject({
      payload: 10,
      type: 'countStore_add',
    });
  });

  it('same reducer for multiple events', () => {
    const upAction = createEvent<number>('up');
    const decAction = createEvent<number>('dec');
    const reducer = jest.fn((state, payload) => state + payload);

    const StoreClass = createReducer('reduceTest', 0).on([upAction, decAction], reducer);

    const store = new StoreClass();

    const ev1 = upAction(5);
    const ev2 = decAction(10);

    store.handle(ev1.payload, ev1.type);
    store.handle(ev2.payload, ev2.type);
    store.handle(99, 'random:dsa');

    expect(reducer).toHaveBeenCalledWith(0, 5);
    expect(store.getState()).toEqual(15);

    expect((StoreClass as any).handlers).toEqual({
      dec: 'handle',
      up: 'handle',
    });
  });
});

describe('option initializer', () => {
  it('should initialize initial state', () => {
    const initialState = { a: 1, b: 2 };

    const StoreClass = createReducer({
      name: 'test',
      initialState,
    });
    const store = new StoreClass();

    expect((StoreClass as any).storeName).toBe('test');
    expect(store.getState()).toBe(initialState);
  });

  it('call reducers on events', () => {
    const reducer1 = jest.fn((state) => ({ ...state, a: 1, b: 5 }));
    const reducer2 = jest.fn((state) => ({ ...state, b: 3, c: 4 }));
    const payload = { c: 5 };

    const StoreClass = createReducer({
      name: 'test',
      initialState: {},
      events: {
        test: reducer1,
        test2: reducer2,
      },
    });

    const store = new StoreClass();

    store.handle(payload, StoreClass.events.test.toString());
    expect(reducer1).toHaveBeenCalledWith({}, payload);
    expect(store.getState()).toEqual({ a: 1, b: 5 });

    store.handle(payload, StoreClass.events.test2.toString());
    expect(reducer2).toHaveBeenCalledWith({ a: 1, b: 5 }, payload);
    expect(store.getState()).toEqual({ a: 1, b: 3, c: 4 });
  });
});
