import type { AbortController } from 'node-abort-controller';
import { ExecutionContextManager } from './executionContextManager';

const createMockPromise = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;

  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return Object.assign(promise, { resolve, reject });
};

describe('ExecutionContextManager', () => {
  it('should return the result of call', async () => {
    const executionManager = new ExecutionContextManager();

    const result = await executionManager.withContext(null, 'root', async (context) => {
      return executionManager.withContext(context, 'inner', async () => {
        return 'response';
      });
    });

    expect(result).toBe('response');
  });

  it('errors should bubble up to the most outer context', async () => {
    const executionManager = new ExecutionContextManager();

    await expect(async () => {
      await executionManager.withContext(null, 'outer', async (context) => {
        await executionManager.withContext(context, 'inner', async (context) => {
          await executionManager.withContext(context, 'inner-ok', async () => {});

          await executionManager.withContext(context, 'inner-error', async () => {
            throw new Error('inner-error-test');
          });
        });
      });
    }).rejects.toMatchObject({
      message: 'inner-error-test',
      executionContextName: 'outer.inner.inner-error',
    });
  });

  it('should abort inner contexts', async () => {
    const executionManager = new ExecutionContextManager();
    const [promise1, promise2] = [createMockPromise(), createMockPromise()];

    let abortController!: AbortController;
    const mockInnerScope = jest.fn();

    const promise = executionManager
      .withContext(null, 'outer', async (context) => {
        await executionManager.withContext(context, 'inner', async (context, ac) => {
          abortController = ac;

          // eslint-disable-next-line jest/no-conditional-expect
          expect(context.abortSignal.aborted).toBeFalsy();

          await executionManager
            .withContext(context, 'inner-1', async (context) => {
              await promise1;
              // eslint-disable-next-line jest/no-conditional-expect
              expect(context.abortSignal.aborted).toBeFalsy();
              await promise2;
              // eslint-disable-next-line jest/no-conditional-expect
              expect(context.abortSignal.aborted).toBeTruthy();
            })
            .catch((error) => {
              throw error.cause;
            });

          expect(context.abortSignal.aborted).toBeTruthy();

          await expect(
            executionManager.withContext(context, 'inner-2', mockInnerScope)
          ).rejects.toThrow('Execution aborted in context "outer.inner.inner-2"');
        });
      })
      .catch((error) => {
        throw error.cause;
      });

    promise1.resolve();
    await Promise.resolve();

    abortController.abort();
    promise2.resolve();
    await Promise.resolve();

    expect(mockInnerScope).not.toHaveBeenCalled();

    return promise;
  });

  it('execution context values', async () => {
    const executionManager = new ExecutionContextManager();

    await executionManager.withContext(
      null,
      { name: 'outer', values: { outer: true } },
      async (context) => {
        expect(context.values).toEqual({ outer: true });
        await executionManager.withContext(
          context,
          { name: 'inner-1', values: { inner: true } },
          async (context) => {
            expect(context.values).toEqual({ outer: true, inner: true });
            await executionManager.withContext(context, '1', async (context) => {
              expect(context.values).toEqual({ outer: true, inner: true });
            });

            await executionManager.withContext(
              context,
              { name: '2', values: { inner: false } },
              async (context) => {
                expect(context.values).toEqual({ outer: true, inner: false });
              }
            );
          }
        );

        await executionManager.withContext(context, 'inner-2', async (context) => {
          expect(context.values).toEqual({ outer: true });
        });
      }
    );
  });
});
