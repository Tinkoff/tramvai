/**
 * @jest-environment jsdom
 */
import React from 'react';

import { testHook, testComponent, act } from '@tramvai/test-react';
import { useStore, createReducer, createEvent } from '@tramvai/state';

function createMockStore() {
  const event = createEvent<number>('update');
  const reducer = createReducer('test', { id: 1 });

  reducer.on(event, (_, payload) => ({ id: payload }));

  return {
    reducer,
    event,
  };
}

describe('useStore', () => {
  it('return reducer state', () => {
    const { reducer } = createMockStore();
    const { result } = testHook(() => useStore(reducer), { stores: [reducer] });

    expect(result.current).toEqual({ id: 1 });
  });

  it('subscribe to reducer changes', () => {
    const { reducer, event } = createMockStore();
    const { context, result } = testHook(() => useStore(reducer), { stores: [reducer] });

    act(() => {
      context.dispatch(event(2));
    });

    expect(result.current).toEqual({ id: 2 });
  });

  it('batch updates (React feature)', () => {
    const { reducer, event } = createMockStore();
    const watchRender = jest.fn();

    const Component = () => {
      const state = useStore(reducer);
      watchRender(state);
      return null;
    };

    const { context } = testComponent(<Component />);

    act(() => {
      context.dispatch(event(2));
      context.dispatch(event(3));
      context.dispatch(event(4));
      context.dispatch(event(5));
    });

    expect(watchRender).toBeCalledTimes(2);
    expect(watchRender).toBeCalledWith({ id: 1 });
    expect(watchRender).toBeCalledWith({ id: 5 });
  });

  it('register new reducer', () => {
    const { reducer } = createMockStore();
    const { result } = testHook(() => useStore(createReducer('lazy', 1)), { stores: [reducer] });

    expect(result.current).toEqual(1);
  });

  it('delete previous lazy reducer', () => {
    let id = 1;

    const { context, result, rerender } = testHook(() => {
      return useStore(createReducer(`lazy id ${id}`, id));
    });

    ++id;
    rerender();

    expect(() => context.getStore('lazy id 1')).toThrow();
    expect(result.current).toEqual(2);

    --id;
    rerender();

    expect(() => context.getStore('lazy id 2')).toThrow();
    expect(result.current).toEqual(1);
  });

  it('zombie children safe (React feature)', () => {
    const { reducer } = createMockStore();
    const removeEvent = createEvent('remove');
    const listReducer = createReducer<any>('list', [{ id: 1 }, { id: 2 }, { id: 3 }]);
    const mapReducer = createReducer<any>('map', { 1: 'first', 2: 'second', 3: 'third' });

    listReducer.on(removeEvent, () => [{ id: 2 }, { id: 3 }]);
    mapReducer.on(removeEvent, () => ({ 2: 'second', 3: 'third' }));

    const watchParentRender = jest.fn();
    const watchChildRender = jest.fn();

    const ChildComponent = ({ id }) => {
      const map = useStore(mapReducer);
      watchChildRender(id, map[id]);
      return null;
    };
    const ParentComponent = () => {
      const list = useStore(listReducer);
      watchParentRender(list);

      return (
        <>
          {list.map((item) => (
            <ChildComponent id={item.id} key={item.id} />
          ))}
        </>
      );
    };

    const { context } = testComponent(<ParentComponent />, { stores: [reducer] });

    act(() => {
      context.dispatch(removeEvent());
    });

    expect(watchParentRender).toBeCalledTimes(2);
    expect(watchParentRender).toBeCalledWith([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(watchParentRender).toBeCalledWith([{ id: 2 }, { id: 3 }]);

    expect(watchChildRender).toBeCalledTimes(5);
    expect(watchChildRender).toBeCalledWith(1, 'first');
    expect(watchChildRender).toBeCalledWith(2, 'second');
    expect(watchChildRender).toBeCalledWith(3, 'third');
    expect(watchChildRender).toBeCalledWith(2, 'second');
    expect(watchChildRender).toBeCalledWith(3, 'third');
  });
});
