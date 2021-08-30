/**
 * @jest-environment jsdom
 */
import React from 'react';
import { useSelector } from '@tramvai/state';
import { testComponent, act } from '@tramvai/test-react';
import { waitRaf } from '@tramvai/test-jsdom';
import { BaseStore } from '../../stores/BaseStore';

const createMockStore = () => {
  return class extends BaseStore<{ id: number }> {
    static storeName = 'test';

    state = { id: 1 };

    inc() {
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState({ id: this.state.id + 1 });
    }
  };
};

const selector = jest.fn(({ test }) => `value=${test.id}`);

const executeCheck = async (
  store: ReturnType<typeof createMockStore>,
  selectorArg: any | any[]
) => {
  const Cmp = () => {
    const state = useSelector(selectorArg, selector);

    return <div>{state}</div>;
  };

  const { render, context } = testComponent(<Cmp />, { stores: [store] });

  expect(selector).toHaveBeenCalledWith({ test: { id: 1 } });
  expect(render.getByText('value=1')).toBeDefined();

  await act(async () => {
    await context.getStore(store).inc();
    await waitRaf();
  });

  expect(selector).toHaveBeenCalledWith({ test: { id: 2 } });
  expect(render.getByText('value=2')).toBeDefined();
  expect(selector).toHaveBeenCalledTimes(3);
};

describe('hooks/useSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line jest/expect-expect
  it('test selector usage', async () => {
    const store = createMockStore();

    return executeCheck(store, [store]);
  });

  // eslint-disable-next-line jest/expect-expect
  it('test selector usage with single store as first arg', async () => {
    const store = createMockStore();

    return executeCheck(store, store);
  });

  it('test selector which returns new value every time', () => {
    const store = createMockStore();
    // eslint-disable-next-line no-shadow
    const selector = jest.fn(() => ({
      x: {},
    }));
    const Cmp = () => {
      const state = useSelector([], selector);

      return <div>{!!state.x}</div>;
    };

    expect(() => testComponent(<Cmp />, { stores: [store] })).not.toThrow();
  });
});
