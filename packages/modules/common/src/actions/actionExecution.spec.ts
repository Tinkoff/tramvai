import { createAction, ACTION_PARAMETERS } from '@tramvai/core';
import { createContainer } from '@tinkoff/dippy';
import { ActionExecution } from './actionExecution';
import { alwaysCondition } from './conditions/always';
import { actionType } from './constants';

const contextMock = { isContext: true };

const createActionNameFactory = (name, result, conditions = {}) =>
  createAction({
    fn: (c, payload) => result.push(`action: ${name} with: ${payload}`),
    name,
    conditions,
  });

describe('actionExecution in global page', () => {
  it('Запуск page действий без каких либо опций', async () => {
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    const action1 = createActionNameFactory('action1', result);
    const action2 = createActionNameFactory('action2', result);

    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);
    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action1 with: @globalAction",
  "action: action2 with: @globalAction",
]
`);
    // Экшен не должен выполниться. Автоматическиая дедубликация
    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);
    await instance.run(action1, '@globalAction', actionType.global);

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action1 with: @globalAction",
  "action: action2 with: @globalAction",
]
`);
  });

  it('Запуск page экшенов с фильтрами', async () => {
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [
        {
          key: 'neverCondition',
          fn: (cheker) => {
            if (cheker.conditions.never) {
              cheker.forbid();
            }
          },
        },
      ],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    await instance.run(
      createActionNameFactory('action1', result),
      '@globalAction',
      actionType.global
    );
    await instance.run(
      createActionNameFactory('action2', result, { never: true }),
      '@globalAction',
      actionType.global
    );
    await instance.run(
      createActionNameFactory('action3', result, { never: true }),
      '@globalAction',
      actionType.global
    );
    await instance.run(
      createActionNameFactory('action4', result),
      '@globalAction',
      actionType.global
    );
    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action1 with: @globalAction",
  "action: action4 with: @globalAction",
]
`);
  });

  it('Множественный запуск page actions с проверкой, что только измененые экшены запускаются ', async () => {
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [alwaysCondition],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    const action1 = createActionNameFactory('action multi 1', result);
    const action2 = createActionNameFactory('action multi 2', result, { always: true });

    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action multi 1 with: @globalAction",
  "action: action multi 2 with: @globalAction",
]
`);

    await instance.run(
      createActionNameFactory('action multi 1', result),
      '@globalAction',
      actionType.global
    );
    await instance.run(action2, '@globalAction', actionType.global);

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action multi 1 with: @globalAction",
  "action: action multi 2 with: @globalAction",
  "action: action multi 2 with: @globalAction",
]
`);
  });

  it('Востанавливаем состояние выполненных экшенов и проверяем на влияние будущих экшенов', async () => {
    const state = {
      actionTramvai: {
        serverState: {
          'action resume 1': { status: 'success', state: { test: '@globalAction' } },
          'action resume 3': { status: 'success', state: { test: '@globalAction' } },
        },
      },
    };
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return state[reducer.storeName];
          }
          return state;
        },
      } as any,
      actionConditionals: [
        {
          key: 'test',
          fn: (cheker) => {
            const last = cheker.payload;
            if (cheker.getState() !== last) {
              cheker.setState(last);
              cheker.allow();
            }
          },
        },
      ],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    const action1 = createActionNameFactory('action resume 1', result);
    const action2 = createActionNameFactory('action resume 2', result);
    const action3 = createActionNameFactory('action resume 3', result);

    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);
    await instance.run(action3, '@globalAction', actionType.global);
    await instance.run(action3, '@globalAction', actionType.global);
    await instance.run(action3, '@globalAction', actionType.global);

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action resume 2 with: @globalAction",
]
`);
  });

  it('Получение и использование значений переданных в conditions экшенов', async () => {
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [
        {
          key: 'value',
          fn: (cheker) => {
            const { role } = cheker.conditions;
            if (role) {
              if (cheker.getState() !== role) {
                cheker.setState(role);
                cheker.allow();
              }
            }
          },
        },
      ],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    const action1 = createActionNameFactory('action 1', result, { role: 'client' });
    const action2 = createActionNameFactory('action 1', result, { role: 'admin' });

    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action1, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);
    await instance.run(action2, '@globalAction', actionType.global);
    await instance.run(action1, '@globalAction', actionType.global);
    // Выполняем экшены по одному разу, дальше из-за одинакового conditions, скипаем

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action 1 with: @globalAction",
  "action: action 1 with: @globalAction",
  "action: action 1 with: @globalAction",
]
`);
  });

  it('Передаем в экшены di, если были добавлены в deps', async () => {
    const instance = new ActionExecution({
      di: createContainer([
        { provide: 'dep1', useValue: 'dep1 value' },
        { provide: 'dep2', useValue: 'dep2 value' },
      ]),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });

    const result = [];
    await instance.run(
      createAction({
        fn: (context, payload, deps) => result.push([context, payload, deps]),
        name: 'action1',
        deps: { dep1: 'dep1', dep2: 'dep2' },
      }),
      '@globalAction',
      actionType.global
    );
    await instance.run(
      createAction({
        fn: (context, payload, deps) => result.push([context, payload, deps]),
        name: 'action2',
        deps: { dep2: 'dep2' },
      }),
      '@globalAction',
      actionType.global
    );
    // Экшен не должен выполниться. Автоматическиая дедубликация
    await instance.run(
      createAction({
        fn: (context, payload, deps) => result.push([context, payload, deps]),
        name: 'action1',
      }),
      '@globalAction',
      actionType.global
    );

    expect(result).toMatchSnapshot();
  });

  it('Преобразование экшенов с старого вида в новый через transformAction', async () => {
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
      transformAction: (action: any) => {
        if (!action[ACTION_PARAMETERS]) {
          return createAction({ fn: action, name: action.name });
        }
        return action;
      },
    });
    const result = [];
    await instance.run(
      createActionNameFactory('action1', result),
      '@globalAction',
      actionType.global
    );
    const actionOld = (c, payload) => result.push(payload);
    await instance.run(actionOld as any, '@globalAction', actionType.global);

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action1 with: @globalAction",
  "@globalAction",
]
`);
  });
});

describe('actionExecution in actions', () => {
  it('Запуск множество экшенов без каких либо опций с изначальным стейтом', async () => {
    const state = {
      actionTramvai: {
        serverState: {
          action1: { status: 'success', state: {} },
          action2: { status: 'success', state: {} },
        },
      },
    };
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return state[reducer.storeName];
          }
          return state;
        },
      } as any,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    const action1 = createActionNameFactory('action1', result);
    const action2 = createActionNameFactory('action2', result);

    await instance.run(action1, 1);
    await instance.run(action2, 2);
    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action1 with: 1",
  "action: action2 with: 2",
]
`);
    // Экшен не должен выполниться. Автоматическиая дедубликация
    await instance.run(action1, 3);
    await instance.run(action1, 4);
    await instance.run(action2, 5);

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action1 with: 1",
  "action: action2 with: 2",
  "action: action1 with: 3",
  "action: action1 with: 4",
  "action: action2 with: 5",
]
`);
  });

  it('Ограничение по ролям', async () => {
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: (reducer?: any) => {
          if (reducer) {
            return undefined;
          }
          return {};
        },
      } as any,
      actionConditionals: [
        {
          key: 'roles',
          fn: (cheker) => {
            const { role } = cheker.conditions;
            if (role) {
              if (role !== 'admin') {
                cheker.forbid();
              }
            }
          },
        },
      ],
      // @ts-ignore
      context: contextMock,
    });
    const result = [];

    const action1 = createActionNameFactory('action 1', result, { role: 'client' });
    const action2 = createActionNameFactory('action 2', result, { role: 'admin' });

    await instance.run(action1, 1);
    await instance.run(action2, 2);
    await instance.run(action2, 3);
    await instance.run(action1, 4);
    // Выполняем экшены по одному разу, дальше из-за одинакового conditions, скипаем

    expect(result).toMatchInlineSnapshot(`
Array [
  "action: action 2 with: 2",
  "action: action 2 with: 3",
]
`);
  });
});
