import noop from '@tinkoff/utils/function/noop';
import { createAction } from '@tramvai/core';
import { throwRedirectFoundError } from '@tinkoff/errors';
import { createContainer } from '@tinkoff/dippy';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { ActionPageRunner } from './actionPageRunner.browser';
import { ActionExecution } from './actionExecution';

const contextMock = {};
const logger = ((() => ({
  warn: noop,
  error: noop,
})) as any) as typeof LOGGER_TOKEN;
describe('actionPageRunnerBrowser', () => {
  it('Базовое использование', async () => {
    const result = [];
    const store: any = { getState: () => ({}), dispatch: () => {} };
    const instanceExecution = new ActionExecution({
      di: createContainer(),
      store,
      actionConditionals: [],
      // @ts-ignore
      context: contextMock,
    });
    const actionRunner = new ActionPageRunner({
      // @ts-ignore
      actionExecution: { run: (fn, payload) => fn(payload) },
      logger,
    });

    await actionRunner.runActions([
      createAction({ name: 'test1', fn: () => result.push(1) }),
      createAction({ name: 'test2', fn: () => result.push(2) }),
      createAction({ name: 'test1', fn: () => result.push(3) }),
    ]);

    expect(result).toEqual([1, 2, 3]);
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
        actionExecution: instanceExecution,
        logger,
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
        actionExecution: instanceExecution,
        logger,
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
