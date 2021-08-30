import noop from '@tinkoff/utils/function/noop';
import { createAction } from '@tramvai/core';
import { throwRedirectFoundError } from '@tinkoff/errors';
import { createContainer } from '@tinkoff/dippy';
import { ActionExecution } from './actionExecution';
import { ActionPageRunner } from './actionPageRunner';

const contextMock = {};

const logger = () => ({
  warn: noop,
  error: noop,
});

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

describe('actionPageRunner', () => {
  it('Запуск множество page действий без каких либо опций', async () => {
    const store: any = { getState: () => ({}), dispatch: () => {} };
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });
    const instance = new ActionPageRunner({
      logger,
      actionExecution: instanceExecution,
      store,
      limitTime: 500,
    });
    const result = [];
    const action1 = createAction({
      fn: (c, payload) => result.push(['action1', payload]),
      name: 'action1',
    });
    const action2 = createAction({
      fn: async (c, payload) => {
        result.push(['action2', payload]);

        await instanceExecution.run(action1, 1);
        return instanceExecution.run(action1, 2);
      },
      name: 'action2',
    });
    await instance.runActions([action1, action2]);

    expect(result).toEqual([
      ['action1', {}],
      ['action2', {}],
      ['action1', 1],
      ['action1', 2],
    ]);
  });

  // TODO Тест работает не верно
  it('Выполнение действий заняло больше установленных значений', async () => {
    let dispatcherPayload;
    const store: any = {
      getState: () => ({}),
      dispatch: (data) => {
        dispatcherPayload = data;
      },
    };
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });
    const instance = new ActionPageRunner({
      logger,
      actionExecution: instanceExecution,
      store,
      limitTime: 500,
    });
    const result = [];
    const prom = instance.runActions([
      createAction({
        fn: () => delay(2000).then(() => result.push(1)),
        name: 'action time 1',
      }),
      createAction({
        fn: () => delay(2000).then(() => result.push(2)),
        name: 'action time 2',
      }),
      createAction({
        fn: () => result.push(3),
        name: 'action time 3',
      }),
    ]);

    // ждем когда отрезовлится action time 3
    Promise.resolve().then(() => {
      jest.runOnlyPendingTimers();
    });

    return prom.then(() => {
      expect(result).toEqual([3]);
      expect(dispatcherPayload).toMatchSnapshot();
    });
  });

  it('Упавшие экшены должны быть исключены из стора', async () => {
    let dispatcherPayload;
    const store: any = {
      getState: () => ({}),
      dispatch: (data) => {
        dispatcherPayload = data;
      },
    };
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });
    const instance = new ActionPageRunner({
      logger,
      actionExecution: instanceExecution,
      store,
      limitTime: 500,
    });
    const result = [];
    await instance.runActions([
      createAction({ fn: () => Promise.reject(new Error('Error')), name: 'action1' }),
      createAction({ fn: () => result.push(2), name: 'action2' }),
    ]);

    expect(result).toEqual([2]);
    expect(dispatcherPayload).toMatchSnapshot();
  });

  describe('Перехват ошибок', () => {
    it('runner не должен падать при ошибках', async () => {
      const store: any = { getState: () => ({}), dispatch: () => {} };
      const instanceExecution = new ActionExecution({
        di: createContainer(),
        store,
        actionConditionals: [],
        // @ts-ignore
        context: contextMock,
      });
      const instance = new ActionPageRunner({
        logger,
        actionExecution: instanceExecution,
        store,
        limitTime: 500,
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
        .then((data) => {
          expect(true).toBe(true);
        });
    });

    it('При кастомных обработка ошибка раннер падает', async () => {
      const store: any = { getState: () => ({}), dispatch: () => {} };
      const instanceExecution = new ActionExecution({
        di: createContainer(),
        store,
        actionConditionals: [],
        // @ts-ignore
        context: contextMock,
      });
      const instance = new ActionPageRunner({
        logger,
        actionExecution: instanceExecution,
        store,
        limitTime: 500,
      });

      const stopRunAtError = (error) => {
        if (error.name === 'RedirectFoundError') {
          return true;
        }
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
