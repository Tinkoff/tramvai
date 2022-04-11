/**
 * @jest-environment jsdom
 */
import React from 'react';
import { testComponent, act } from '@tramvai/test-react';
import { waitRaf } from '@tramvai/test-jsdom';
import { useStoreSelector, createReducer, createEvent } from '@tramvai/state';

const increment = createEvent('increment');

const createMockStore = (storeName: string) => {
  return createReducer(storeName, { id: 1 }).on(increment, ({ id }) => {
    return { id: id + 1 };
  });
};

describe('hooks/useStoreSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test selector usage', async () => {
    const store = createMockStore('test');
    const selector = jest.fn(({ id }) => `value=${id}`);

    const Cmp = () => {
      const state = useStoreSelector(store, selector);

      return <div>{state}</div>;
    };

    const { render, context } = testComponent(<Cmp />, { stores: [store] });

    expect(selector).toHaveBeenCalledWith({ id: 1 });
    expect(render.getByText('value=1')).toBeDefined();

    await act(async () => {
      await context.dispatch(increment());

      await waitRaf();
    });

    expect(selector).toHaveBeenCalledTimes(2);
    expect(selector).toHaveBeenLastCalledWith({ id: 2 });
    expect(render.getByText('value=2')).toBeDefined();
  });

  it('test selector which returns new value every time', () => {
    const store = createMockStore('test');
    const selector = jest.fn(() => ({
      x: {},
    }));
    const Cmp = () => {
      const state = useStoreSelector(store, selector);

      return <div>{!!state.x}</div>;
    };

    expect(() => testComponent(<Cmp />, { stores: [store] })).not.toThrow();
  });
});
