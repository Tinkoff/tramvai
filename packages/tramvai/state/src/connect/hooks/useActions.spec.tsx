/**
 * @jest-environment jsdom
 */
import React from 'react';
import { createMockContext } from '@tramvai/test-mocks';
import { testComponent } from '@tramvai/test-react';
import { useActions } from '@tramvai/state';

describe('hooks/useActions', () => {
  it('should return one action', () => {
    const context = createMockContext();
    const payload = { a: 1, b: 2 };

    const action = jest.fn();
    const Cmp = () => {
      const act = useActions(action);

      act(payload);

      return <div>test</div>;
    };

    jest.spyOn(context, 'executeAction').mockImplementation((fn: any, pl) => fn(pl));

    testComponent(<Cmp />, { context });

    expect(context.executeAction).toHaveBeenCalledWith(action, payload);
    expect(action).toHaveBeenCalledWith(payload);
  });

  it('should return two actions', () => {
    const context = createMockContext();
    const payload1 = { a: 1, b: 2 };
    const payload2 = 'test';

    const action1 = jest.fn();
    const action2 = jest.fn();
    const Cmp = () => {
      const [act1, act2] = useActions([action1, action2]);

      act1(payload1);
      act2(payload2);

      return <div>test</div>;
    };

    jest.spyOn(context, 'executeAction').mockImplementation((fn: any, pl) => fn(pl));

    testComponent(<Cmp />, { context });

    expect(context.executeAction).toHaveBeenCalledWith(action1, payload1);
    expect(action1).toHaveBeenCalledWith(payload1);

    expect(context.executeAction).toHaveBeenCalledWith(action2, payload2);
    expect(action2).toHaveBeenCalledWith(payload2);
  });
});
