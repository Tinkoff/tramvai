import { createAction } from './createActions';
import { ACTION_PARAMETERS } from '../types/action';

describe('createAction', () => {
  it('Создание и вызов экшена', () => {
    const result = [];
    const action = createAction({
      name: 'ActionTadam',
      fn: () => {
        result.push('run');
      },
    });

    expect(typeof action).toBe('function');

    action(
      {
        dispatch: jest.fn(),
        dispatchWith: jest.fn(),
        executeAction: jest.fn(),
        getStore: jest.fn(),
        getState: jest.fn(),
      } as any,
      undefined,
      {}
    );

    expect(result).toEqual(['run']);
    expect(ACTION_PARAMETERS in action).toBe(true);
  });
});
