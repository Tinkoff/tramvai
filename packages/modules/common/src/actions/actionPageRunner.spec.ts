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

const exhaustPromiseQueue = async (times: number) => {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
};

describe('execution', () => {
  it('Running several page actions without options', async () => {
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
});

describe('errors', () => {
  it('Failed actions should not be added to store', async () => {
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
      {
        "payload": {
          "action2": {
            "state": {},
            "status": "success",
          },
        },
        "store": [Function],
        "type": "action state execution in server",
      }
    `);
  });

  it('runner should not fail on action errors', async () => {
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

  it('Execution should fail if custom error handler is provided', async () => {
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
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.name).toBe('RedirectFoundError');
      });
  });
});

describe('limits', () => {
  it('Execution of actions excesses limits', async () => {
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

    await exhaustPromiseQueue(5);
    jest.advanceTimersByTime(700);

    return prom.then(() => {
      expect(dispatcherPayload).toMatchInlineSnapshot(`
        {
          "payload": {
            "action time 3": {
              "state": {},
              "status": "success",
            },
          },
          "store": [Function],
          "type": "action state execution in server",
        }
      `);
      expect(result).toEqual([3]);
    });
  });

  it('Excessing limits should abort any new actions', async () => {
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

    const innerAction1 = createAction({
      fn: () => delay(200).then(() => result.push(1)),
      name: 'action 1',
    });
    const innerAction2 = declareAction({
      fn: () => delay(200).then(() => result.push(2)),
      name: 'action 2',
    });
    const innerAction3 = createAction({
      fn: () => delay(200).then(() => result.push(3)),
      name: 'action 3',
    });
    const innerAction4 = declareAction({
      fn: () => delay(200).then(() => result.push(4)),
      name: 'action 4',
    });

    const prom = instance.runActions([
      declareAction({
        async fn() {
          result.push(0);

          await this.executeAction(innerAction1);
          await this.executeAction(innerAction2);
          await this.executeAction(innerAction3);
          await this.executeAction(innerAction4);
        },
        name: 'root action',
      }),
    ]);

    await exhaustPromiseQueue(5);
    jest.advanceTimersByTime(300);

    await exhaustPromiseQueue(10);
    jest.runAllTimers();

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    return prom.then(() => {
      expect(dispatcherPayload).toMatchInlineSnapshot(`
        {
          "payload": {
            "action 1": {
              "state": {},
              "status": "success",
            },
          },
          "store": [Function],
          "type": "action state execution in server",
        }
      `);
      expect(result).toEqual([0, 1, 2]);
    });
  });
});
