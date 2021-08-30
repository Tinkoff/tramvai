import { createAction, ActionContext } from '@tramvai/core';
import { ActionRegistry, GLOBAL_PARAMETER } from './actionRegistry';

const action1 = createAction({ fn: () => 1, name: 'action1' });
const action2 = createAction({ fn: () => 2, name: 'action2' });
const action3 = createAction({ fn: () => 3, name: 'action3' });
const action4 = createAction({ fn: () => 4, name: 'action4' });

describe('actionRegistry', () => {
  it('Инициализация экшенов', () => {
    const actions = new ActionRegistry({
      actionsList: [action1, action2, action2, action3, action1, action4],
    });

    expect(actions.get(GLOBAL_PARAMETER).length).toBe(4);
    expect(
      actions.get(GLOBAL_PARAMETER).map((i) =>
        i(
          {
            dispatch: jest.fn(),
            dispatchWith: jest.fn(),
            executeAction: jest.fn(),
            getStore: jest.fn(),
            getState: jest.fn(),
          } as any,
          undefined,
          {}
        )
      )
    ).toEqual([1, 2, 3, 4]);
  });

  it('Работа с бандл экшенами', () => {
    const actions = new ActionRegistry({ actionsList: [action1, action1] });
    actions.add('home/main', [action2, action2]);
    actions.add('home/pay', [action2, action3]);
    actions.add('home/pay', [action4]);

    expect(actions.get('home/main').length).toBe(1);
    expect(actions.get('home/pay').length).toBe(3);
  });
});
