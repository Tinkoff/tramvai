/**
 * @jest-environment jsdom
 */
import { declareAction } from '@tramvai/core';
import { createMockContext } from '@tramvai/test-mocks';
import { testComponent } from '@tramvai/test-react';
import { useActions } from '@tramvai/state';

describe('hooks/useActions', () => {
  it('should return one action', () => {
    const context = createMockContext();
    const payload = { a: 1, b: 2 };

    const fn = jest.fn();
    const action = declareAction({
      name: 'test',
      fn,
    });
    const Cmp = () => {
      const act = useActions(action);

      act(payload);

      return <div>test</div>;
    };

    jest.spyOn(context, 'executeAction').mockImplementation((action: any, pl) => action.fn(pl));

    testComponent(<Cmp />, { context });

    expect(context.executeAction).toHaveBeenCalledWith(action, payload);
    expect(fn).toHaveBeenCalledWith(payload);
  });

  it('should return two actions', () => {
    const context = createMockContext();
    const payload1 = { a: 1, b: 2 };
    const payload2 = 'test';

    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const action1 = declareAction({
      name: 'test1',
      fn: fn1,
    });

    const action2 = declareAction({
      name: 'test2',
      fn: fn2,
    });

    const Cmp = () => {
      const [act1, act2] = useActions([action1, action2]);

      act1(payload1);
      act2(payload2);

      return <div>test</div>;
    };

    jest.spyOn(context, 'executeAction').mockImplementation((action: any, pl) => action.fn(pl));

    testComponent(<Cmp />, { context });

    expect(context.executeAction).toHaveBeenCalledWith(action1, payload1);
    expect(fn1).toHaveBeenCalledWith(payload1);

    expect(context.executeAction).toHaveBeenCalledWith(action2, payload2);
    expect(fn2).toHaveBeenCalledWith(payload2);
  });
});
