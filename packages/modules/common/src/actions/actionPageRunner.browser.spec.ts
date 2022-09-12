import noop from '@tinkoff/utils/function/noop';
import { createAction, declareAction } from '@tramvai/core';
import { throwRedirectFoundError } from '@tinkoff/errors';
import { createContainer } from '@tinkoff/dippy';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { ActionPageRunner } from './actionPageRunner.browser';
import { ActionExecution } from './actionExecution';
import { ExecutionContextManager } from '../executionContext/executionContextManager';

const contextMock = {};
const logger: any = (() => ({
  warn: noop,
  error: noop,
})) as any as typeof LOGGER_TOKEN;

describe('actionPageRunnerBrowser', () => {
  it('Базовое использование', async () => {
    const result: number[] = [];
    const store: any = { getState: () => ({}), dispatch: () => {} };
    const executionContextManager = new ExecutionContextManager();
    const actionExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
      executionContextManager,
    });
    const actionRunner = new ActionPageRunner({
      actionExecution,
      logger,
      executionContextManager,
      commandLineExecutionContext: () => null,
    });

    await actionRunner.runActions([
      createAction({ name: 'test1', fn: () => result.push(1) }),
      createAction({ name: 'test2', fn: () => result.push(2) }),
      declareAction({ name: 'test1', fn: () => result.push(3) }),
    ]);

    expect(result).toEqual([1, 2, 3]);
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
        actionExecution: instanceExecution,
        logger,
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
        actionExecution: instanceExecution,
        logger,
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
});
