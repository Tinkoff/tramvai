import { createAction, declareAction } from '@tramvai/core';
import { createEvent } from '@tramvai/state';
import { createMockStore } from '@tramvai/test-mocks';
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
    const store = createMockStore();
    const event = createEvent<string>('test');

    const action = declareAction({
      name: 'dispatch',
      fn(payload: string) {
        return this.dispatch(event(`action${payload}`));
      },
    });

    const spyDispatch = jest.spyOn(store, 'dispatch');

    const { run } = testAction(action, { store });

    await run('ping');

    expect(spyDispatch).toHaveBeenCalledWith({ payload: 'actionping', type: 'test' });

    await run('pong');

    expect(spyDispatch).toHaveBeenCalledWith({ payload: 'actionpong', type: 'test' });
  });

  it('should not require payload', async () => {
    const action = declareAction({
      name: 'no-payload',
      fn() {
        return 'empty';
      },
    });

    const { run } = testAction(action);

    await expect(run()).resolves.toBe('empty');
  });
});
