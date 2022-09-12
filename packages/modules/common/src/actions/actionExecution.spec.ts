import type { TramvaiActionDefinition } from '@tramvai/core';
import { createAction, declareAction, ACTION_PARAMETERS } from '@tramvai/core';
import { createContainer } from '@tinkoff/dippy';
import { ActionExecution } from './actionExecution';
import { alwaysCondition } from './conditions/always';
import { ExecutionContextManager } from '../executionContext/executionContextManager';

const contextMock = { isContext: true };

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const legacyActionNameFactory = (name: string, result: string[], conditions = {}) =>
  createAction({
    fn: (c, payload) => result.push(`action: ${name} with: ${payload}`),
    name,
    conditions,
  });

const actionNameFactory = (
  name: string,
  result: string[],
  options: Partial<TramvaiActionDefinition<any, any, any>> = {}
) =>
  declareAction({
    fn: (c, payload) => result.push(`action: ${name} with: ${payload}`),
    name,
    ...options,
  });

describe('actionExecution in global page', () => {
  it('Запуск page действий без каких либо опций', async () => {
    const executionContextManager = new ExecutionContextManager();

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
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = legacyActionNameFactory('action1', result);
    const action2 = legacyActionNameFactory('action2', result);

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
      }
    );
    expect(result).toMatchInlineSnapshot(`
      [
        "action: action1 with: @globalAction",
        "action: action2 with: @globalAction",
      ]
    `);
    // Экшен не должен выполниться. Автоматическиая дедубликация
    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
        await instance.runInContext(context, action1, '@globalAction');
      }
    );

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action1 with: @globalAction",
        "action: action2 with: @globalAction",
      ]
    `);
  });

  it('Запуск page экшенов с фильтрами', async () => {
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
    });
    const result: string[] = [];

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(
          context,
          legacyActionNameFactory('action1', result),
          '@globalAction'
        );
        await instance.runInContext(
          context,
          legacyActionNameFactory('action2', result, { never: true }),
          '@globalAction'
        );
        await instance.runInContext(
          context,
          legacyActionNameFactory('action3', result, { never: true }),
          '@globalAction'
        );
        await instance.runInContext(
          context,
          legacyActionNameFactory('action4', result),
          '@globalAction'
        );
      }
    );

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action1 with: @globalAction",
        "action: action4 with: @globalAction",
      ]
    `);
  });

  it('Множественный запуск page actions с проверкой, что только измененые экшены запускаются', async () => {
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = legacyActionNameFactory('action multi 1', result);
    const action2 = legacyActionNameFactory('action multi 2', result, { always: true });

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
      }
    );

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action multi 1 with: @globalAction",
        "action: action multi 2 with: @globalAction",
      ]
    `);
    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(
          context,
          legacyActionNameFactory('action multi 1', result),
          '@globalAction'
        );
        await instance.runInContext(context, action2, '@globalAction');
      }
    );

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action multi 1 with: @globalAction",
        "action: action multi 2 with: @globalAction",
        "action: action multi 2 with: @globalAction",
      ]
    `);
  });

  it('Востанавливаем состояние выполненных экшенов и проверяем на влияние будущих экшенов', async () => {
    const state: any = {
      actionTramvai: {
        serverState: {
          'action resume 1': { status: 'success', state: { test: '@globalAction' } },
          'action resume 3': { status: 'success', state: { test: '@globalAction' } },
        },
      },
    };
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = legacyActionNameFactory('action resume 1', result);
    const action2 = legacyActionNameFactory('action resume 2', result);
    const action3 = legacyActionNameFactory('action resume 3', result);

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
        await instance.runInContext(context, action3, '@globalAction');
        await instance.runInContext(context, action3, '@globalAction');
        await instance.runInContext(context, action3, '@globalAction');
      }
    );

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action resume 2 with: @globalAction",
      ]
    `);
  });

  it('Передаем в экшены di, если были добавлены в deps', async () => {
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
    });

    const result: any[] = [];

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(
          context,
          createAction({
            fn: (context, payload, deps) => result.push([context, payload, deps]),
            name: 'action1',
            deps: { dep1: 'dep1', dep2: 'dep2' },
          }),
          '@globalAction'
        );
        await instance.runInContext(
          context,
          createAction({
            fn: (context, payload, deps) => result.push([context, payload, deps]),
            name: 'action2',
            deps: { dep2: 'dep2' },
          }),
          '@globalAction'
        );
        // Экшен не должен выполниться. Автоматическиая дедубликация
        await instance.runInContext(
          context,
          createAction({
            fn: (context, payload, deps) => result.push([context, payload, deps]),
            name: 'action1',
          }),
          '@globalAction'
        );
      }
    );

    expect(result).toMatchSnapshot();
  });

  it('Преобразование экшенов с старого вида в новый через transformAction', async () => {
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
      transformAction: (action: any) => {
        if (!action[ACTION_PARAMETERS]) {
          return createAction({ fn: action, name: action.name });
        }
        return action;
      },
    });
    const result: string[] = [];

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(
          context,
          legacyActionNameFactory('action1', result),
          '@globalAction'
        );
      }
    );
    const actionOld = (c: any, payload: string) => result.push(payload);

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(context, actionOld as any, '@globalAction');
      }
    );

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action1 with: @globalAction",
        "@globalAction",
      ]
    `);
  });
});

describe('actionExecution in actions', () => {
  it('Запуск множество экшенов без каких либо опций с изначальным стейтом', async () => {
    const executionContextManager = new ExecutionContextManager();
    const state: any = {
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
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = legacyActionNameFactory('action1', result);
    const action2 = legacyActionNameFactory('action2', result);

    await instance.run(action1, 1);
    await instance.run(action2, 2);

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action1 with: 1",
        "action: action2 with: 2",
      ]
    `);

    await instance.run(action1, 3);
    await instance.run(action1, 4);
    await instance.run(action2, 5);

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action1 with: 1",
        "action: action2 with: 2",
        "action: action1 with: 3",
        "action: action1 with: 4",
        "action: action2 with: 5",
      ]
    `);
  });

  it('Ограничение по ролям', async () => {
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = legacyActionNameFactory('action 1', result, { role: 'client' });
    const action2 = legacyActionNameFactory('action 2', result, { role: 'admin' });

    await instance.run(action1, 1);
    await instance.run(action2, 2);
    await instance.run(action2, 3);
    await instance.run(action1, 4);
    // Выполняем экшены по одному разу, дальше из-за одинакового conditions, скипаем

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action 2 with: 2",
        "action: action 2 with: 3",
      ]
    `);
  });
});

describe('action conditions', () => {
  it('Получение и использование значений переданных в conditions экшенов', async () => {
    const executionContextManager = new ExecutionContextManager();
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
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = legacyActionNameFactory('action 1', result, { role: 'client' });
    const action2 = legacyActionNameFactory('action 2', result, { role: 'admin' });

    await executionContextManager.withContext(
      null,
      { name: 'test', values: { pageActions: true } },
      async (context) => {
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action1, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
        await instance.runInContext(context, action2, '@globalAction');
        await instance.runInContext(context, action1, '@globalAction');
      }
    );
    // Выполняем экшены по одному разу, дальше из-за одинакового conditions, скипаем

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action 1 with: @globalAction",
        "action: action 2 with: @globalAction",
      ]
    `);
  });

  it('Should use conditionsFailResult', async () => {
    const executionContextManager = new ExecutionContextManager();
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
          key: 'role',
          fn: (checker) => {
            const { role } = checker.conditions;

            if (role !== 'admin') {
              checker.forbid();
            }
          },
        },
      ],
      // @ts-ignore
      context: contextMock,
      executionContextManager,
    });
    const result: string[] = [];

    const action1 = actionNameFactory('action 1', result, {
      conditions: { role: 'client' },
      conditionsFailResult: 'empty',
    });
    const action2 = actionNameFactory('action 2', result, {
      conditions: { role: 'client' },
      conditionsFailResult: 'reject',
    });
    const action3 = actionNameFactory('action 3', result, {
      conditions: { role: 'admin' },
      conditionsFailResult: 'empty',
    });
    const action4 = actionNameFactory('action 4', result, {
      conditions: { role: 'admin' },
      conditionsFailResult: 'reject',
    });

    await instance.run(action1);
    await expect(instance.run(action2)).rejects.toMatchObject({
      message: 'Condition failed',
      conditionName: 'role',
      targetName: 'action 2',
    });
    await instance.run(action3);
    await instance.run(action4);

    expect(result).toMatchInlineSnapshot(`
      [
        "action: action 3 with: undefined",
        "action: action 4 with: undefined",
      ]
    `);
  });
});

describe('cancelling actions', () => {
  it('should cancel inner actions', async () => {
    const executionContextManager = new ExecutionContextManager();
    const instance = new ActionExecution({
      di: createContainer(),
      store: {
        getState: () => {
          return {};
        },
      } as any,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
      executionContextManager,
    });

    const innerAction1 = declareAction({
      name: 'inner-1',
      async fn() {
        await delay(2000);

        return 'inner-1';
      },
    });
    const innerAction2 = declareAction({
      name: 'inner-2',
      async fn() {
        if (this.abortSignal.aborted) {
          return 'aborted-2';
        }

        return 'inner-2';
      },
    });

    const action = declareAction({
      name: 'root',
      async fn(abort: boolean) {
        abort && this.abortController.abort();

        const promise = this.executeAction(innerAction1).catch(() => 'error-1');

        await Promise.resolve();
        jest.runAllTimers();

        const r1 = await promise;
        const r2 = await this.executeAction(innerAction2).catch(() => 'error-2');

        return `${r1}_${r2}`;
      },
    });

    expect(await instance.run(action, true)).toBe('error-1_error-2');

    expect(await instance.run(action, false)).toBe('inner-1_inner-2');
  });
});
