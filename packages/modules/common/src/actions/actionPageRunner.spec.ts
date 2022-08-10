import noop from '@tinkoff/utils/function/noop';
import { createAction, declareAction } from '@tramvai/core';
import { throwRedirectFoundError } from '@tinkoff/errors';
import { createContainer } from '@tinkoff/dippy';
import { ActionExecution } from './actionExecution';
import { ActionPageRunner } from './actionPageRunner';
import { ExecutionContextManager } from '../executionContext/executionContextManager';

const contextMock = {};

const logger: any = () => ({
  warn: noop,
  error: noop,
});

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('actionPageRunner', () => {
  it('Запуск множество page действий без каких либо опций', async () => {
    const store: any = { getState: () => ({}), dispatch: () => {} };
    const executionContextManager = new ExecutionContextManager();
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
      executionContextManager,
    });
    const instance = new ActionPageRunner({
      logger,
      actionExecution: instanceExecution,
      store,
      limitTime: 500,
      executionContextManager,
      commandLineExecutionContext: () => null,
    });
    const result: any[] = [];
    const action1 = createAction({
      fn: (c, payload) => result.push(['action1', payload]),
      name: 'action1',
    });
    const action2 = declareAction({
      fn: async (payload) => {
        result.push(['action2', payload]);

        await instanceExecution.run(action1, 1);
        return instanceExecution.run(action1, 2);
      },
      name: 'action2',
    });
    await instance.runActions([action1, action2]);

    expect(result).toEqual([
      ['action1', {}],
      ['action2', undefined],
      ['action1', 1],
      ['action1', 2],
    ]);
  });

  // TODO Тест работает не верно
  it('Выполнение действий заняло больше установленных значений', async () => {
    let dispatcherPayload: any;
    const store: any = {
      getState: () => ({}),
      dispatch: (data: any) => {
        dispatcherPayload = data;
      },
    };
    const executionContextManager = new ExecutionContextManager();
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
      executionContextManager,
    });
    const instance = new ActionPageRunner({
      logger,
      actionExecution: instanceExecution,
      store,
      limitTime: 500,
      executionContextManager,
      commandLineExecutionContext: () => null,
    });
    const result: number[] = [];
    const prom = instance.runActions([
      createAction({
        fn: () => delay(2000).then(() => result.push(1)),
        name: 'action time 1',
      }),
      createAction({
        fn: () => delay(2000).then(() => result.push(2)),
        name: 'action time 2',
      }),
      declareAction({
        fn: () => result.push(3),
        name: 'action time 3',
      }),
    ]);

    // ждем когда отрезовлится action time 3
    Promise.resolve().then(() => {
      jest.runOnlyPendingTimers();
    });

    return prom.then(() => {
      expect(dispatcherPayload).toMatchInlineSnapshot(`
        Object {
          "payload": Object {},
          "type": "action state execution in server",
        }
      `);
      expect(result).toEqual([3]);
    });
  });

  it('Упавшие экшены должны быть исключены из стора', async () => {
    let dispatcherPayload: any;
    const store: any = {
      getState: () => ({}),
      dispatch: (data: any) => {
        dispatcherPayload = data;
      },
    };

    const executionContextManager = new ExecutionContextManager();
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
      executionContextManager,
    });
    const instance = new ActionPageRunner({
      logger,
      actionExecution: instanceExecution,
      store,
      limitTime: 500,
      executionContextManager,
      commandLineExecutionContext: () => null,
    });
    const result: number[] = [];
    await instance.runActions([
      createAction({ fn: () => Promise.reject(new Error('Error')), name: 'action1' }),
      declareAction({ fn: () => result.push(2), name: 'action2' }),
    ]);

    expect(result).toEqual([2]);
    expect(dispatcherPayload).toMatchInlineSnapshot(`
      Object {
        "payload": Object {
          "action2": Object {
            "state": Object {},
            "status": "success",
          },
        },
        "type": "action state execution in server",
      }
    `);
  });

  describe('Перехват ошибок', () => {
    it('runner не должен падать при ошибках', async () => {
      const store: any = { getState: () => ({}), dispatch: () => {} };
      const executionContextManager = new ExecutionContextManager();
      const instanceExecution = new ActionExecution({
        di: createContainer(),
        store,
        actionConditionals: [],
        // @ts-ignore
        context: contextMock,
        executionContextManager,
      });
      const instance = new ActionPageRunner({
        logger,
        actionExecution: instanceExecution,
        store,
        limitTime: 500,
        executionContextManager,
        commandLineExecutionContext: () => null,
      });

      expect.assertions(1);

      return instance
        .runActions([
          createAction({
            fn: () =>
              Promise.resolve(1).then(() => {
                throw new Error('213');
              }),
            name: 'action1',
          }),
        ])
        .then(() => {
          expect(true).toBe(true);
        });
    });

    it('При кастомных обработка ошибка раннер падает', async () => {
      const store: any = { getState: () => ({}), dispatch: () => {} };
      const executionContextManager = new ExecutionContextManager();
      const instanceExecution = new ActionExecution({
        di: createContainer(),
        store,
        actionConditionals: [],
        // @ts-ignore
        context: contextMock,
        executionContextManager,
      });
      const instance = new ActionPageRunner({
        logger,
        actionExecution: instanceExecution,
        store,
        limitTime: 500,
        executionContextManager,
        commandLineExecutionContext: () => null,
      });

      const stopRunAtError = (error: Error) => {
        return error.name === 'RedirectFoundError';
      };

      expect.assertions(1);

      return instance
        .runActions(
          [
            createAction({
              fn: () => Promise.resolve(1).then(() => throwRedirectFoundError({ nextUrl: '' })),
              name: 'action1',
            }),
          ],
          stopRunAtError
        )
        .catch((error) => {
          expect(error.name).toBe('RedirectFoundError');
        });
    });
  });
});
