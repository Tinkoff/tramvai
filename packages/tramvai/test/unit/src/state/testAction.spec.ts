import { createAction } from '@tramvai/core';
import { createEvent } from '@tramvai/state';
import { createMockContext } from '@tramvai/test-mocks';
import { testAction } from './testAction';

describe('test/unit/state/testAction', () => {
  it('should call action', async () => {
    const action = createAction({
      name: 'test',
      fn: (context, payload: boolean) => {
        if (payload) {
          return 'hello';
        }

        return 'world';
      },
    });

    const { run } = testAction(action);

    expect(await run(true)).toBe('hello');
    expect(await run(false)).toBe('world');
  });

  it('should call action with custom context', async () => {
    const context = createMockContext();
    const event = createEvent<string>('test');

    const action = createAction({
      name: 'dispatch',
      fn: (ctx, payload: string) => {
        return ctx.dispatch(event(`action${payload}`));
      },
    });

    const spyDispatch = jest.spyOn(context, 'dispatch');

    const { run } = testAction(action, { context });

    await run('ping');

    expect(spyDispatch).toHaveBeenCalledWith({ payload: 'actionping', type: 'test' });

    await run('pong');

    expect(spyDispatch).toHaveBeenCalledWith({ payload: 'actionpong', type: 'test' });
  });
});
