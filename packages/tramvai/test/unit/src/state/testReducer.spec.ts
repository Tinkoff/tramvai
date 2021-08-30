import { createEvent, createReducer } from '@tramvai/state';
import { testReducer } from './testReducer';

describe('test/unit/testReducer', () => {
  it('should handle state change', () => {
    const handle = jest.fn((state, payload) => {
      return [...state, payload];
    });
    const event = createEvent<number>('push');
    const reducer = createReducer('test', []).on(event, handle);

    const { dispatch, getState } = testReducer(reducer);

    expect(getState()).toEqual([]);
    expect(handle).not.toHaveBeenCalled();

    dispatch(event(1));

    expect(getState()).toEqual([1]);
    expect(handle).toHaveBeenCalledWith([], 1);

    dispatch(event(3));

    expect(getState()).toEqual([1, 3]);
    expect(handle).toHaveBeenCalledWith([1], 3);
  });

  it('should handle several tests reducers at separate', () => {
    const event = createEvent<number>('push');
    const reducer = createReducer('test', []).on(event, (state, payload) => {
      return [...state, payload];
    });

    const test1 = testReducer(reducer);
    const test2 = testReducer(reducer);

    expect(test1.getState()).toEqual([]);
    expect(test2.getState()).toEqual([]);

    test1.dispatch(event(1));

    expect(test1.getState()).toEqual([1]);
    expect(test2.getState()).toEqual([]);

    test2.dispatch(event(2));

    expect(test1.getState()).toEqual([1]);
    expect(test2.getState()).toEqual([2]);
  });
});
