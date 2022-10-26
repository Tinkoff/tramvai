import type {
  ExecutionContext,
  ExecutionContextManager as Interface,
  ExecutionContextOptions,
} from '@tramvai/tokens-common';
import { ExecutionAbortError } from '@tinkoff/errors';
import { AbortController } from 'node-abort-controller';

const EMPTY_VALUES = {};

const normalizeOptions = (
  nameOrOptions: string | ExecutionContextOptions
): ExecutionContextOptions => {
  return typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions;
};

export class ExecutionContextManager implements Interface {
  public async withContext<T>(
    parentContext: ExecutionContext | null,
    nameOrOptions: string | ExecutionContextOptions,
    cb: (context: ExecutionContext, abortController: AbortController) => Promise<T>
  ): Promise<T> {
    const options = normalizeOptions(nameOrOptions);
    const { name, values: selfValues = EMPTY_VALUES } = options;

    const contextName = parentContext ? `${parentContext.name}.${name}` : name;

    if (parentContext?.abortSignal.aborted) {
      throw new ExecutionAbortError({
        message: `Execution aborted in context "${contextName}"`,
        contextName,
      });
    }

    const abortController = new AbortController();
    let abortListener: () => void;

    let values = selfValues;

    if (parentContext) {
      values = {
        ...parentContext.values,
        ...selfValues,
      };
      abortListener = () => {
        abortController.abort();
      };
      // abort child context AbortController if parent AbortController was aborted
      parentContext.abortSignal.addEventListener('abort', abortListener);
    }

    const context: ExecutionContext = {
      name: contextName,
      abortSignal: abortController.signal,
      values,
    };

    try {
      const result = await cb(context, abortController);

      return result;
    } catch (error: any) {
      if (!error.executionContextName) {
        error.executionContextName = context.name;
      }

      throw error;
    } finally {
      // @ts-expect-error
      if (abortListener && parentContext) {
        parentContext.abortSignal.removeEventListener('abort', abortListener);
      }
    }
  }
}
