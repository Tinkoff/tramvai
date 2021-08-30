/**
 * @jest-environment jsdom
 */

import { createReducer, createEvent, useStore } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { useRoute } from '@tinkoff/router';
import { waitRaf } from '@tramvai/test-jsdom';
import { testHook } from './testHook';

describe('test/unit/react/testHook', () => {
  it('should render simple hook', async () => {
    const useHook = jest.fn((p: string) => 'result');

    const { result } = testHook(() => useHook('test'));

    expect(result.current).toBe('result');
    expect(useHook).toHaveBeenCalledWith('test');
  });

  it('should rerender hook', async () => {
    const event = createEvent<void>('evnt');
    const store = createReducer('store', { a: 1 }).on(event, (state) => ({ a: state.a + 1 }));

    const useHook = () => {
      return useStore(store).a;
    };

    const { context, result, act } = testHook(() => useHook(), { stores: [store] });
    expect(result.current).toBe(1);

    await act(async () => {
      await context.dispatch(event());
      await waitRaf();
    });

    expect(result.current).toBe(2);
  });

  it('should work with di', async () => {
    const useHook = () => {
      return useDi({ provider: 'provider' }).provider;
    };

    const { result } = testHook(() => useHook(), {
      providers: [
        {
          provide: 'provider',
          useValue: 'test',
        },
      ],
    });

    expect(result.current).toEqual('test');
  });

  it('should work with routing', async () => {
    const useHook = () => {
      const route = useRoute();

      return [route.actualPath, route.name];
    };

    const { result } = testHook(() => useHook(), {
      currentRoute: { name: 'test', path: '/test/' },
    });

    expect(result.current).toEqual(['/test/', 'test']);
  });
});
